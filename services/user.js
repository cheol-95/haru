const fs = require('fs');
const path = require('path');
const firebase = require('firebase');

const userDao = require('../dao/user');
const studyDao = require('../dao/study');
const { toBoolean, parsingAddress } = require('../utils/query');
const { verifyRefreshToken, getAccessToken, getRefreshToken, getPayload } = require('../utils/jwt.js');
const { customError } = require('../utils/errors/custom');
const { firebaseError } = require('../utils/errors/firebase');
const { push } = require('./push');

const { RedisEventEnum, PushEventEnum } = require('../utils/variables/enum');


const checkNickname = async ({ nickname }) => {
  const checkRows = await userDao.checkNickname(nickname);
  if (checkRows.length > 0) {
    throw customError(400, '중복된 닉네임이 존재합니다');
  }
};

const checkEmail = async ({ email }) => {
  const checkRows = await userDao.checkEmail(email);
  if (checkRows.length > 0) {
    return { duplicate: true };
  }
  return { duplicate: false };
};


const logout = async ({ id }) => {
  const emptyToken = { pushToken: '' };
  const logoutRows = await userDao.updateUser(id, emptyToken);
  if (logoutRows.length === 0) {
    throw customError(400, '로그아웃 실패');
  }
};

const getUser = async ({ id }) => {
  const userDataRows = await userDao.getUser(id);
  if (userDataRows.length === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
  return toBoolean(userDataRows, ['email_verified'])[0];
};

const updateUser = async ({ id }, updateData) => {
  // if (updateData.nickname) {
  //   const checkRows = await userDao.checkNickname(updateData.nickname, id);
  //   if (checkRows.length) {
  //     throw customError(400, '중복된 닉네임이 존재합니다');
  //   }
  // }
  const updateRows = await userDao.updateUser(id, updateData);
  if (updateRows.affectedRows === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
};

const updateUserImage = async ({ id }, updateData, fileData) => {
  const previousPath = await userDao.getImage(id);

  const updateRows = await userDao.updateUser(id, updateData);
  if (updateRows.affectedRows === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
  if (previousPath[0].image) {
    const removeImagePath = path.join(USER_IMAGE_PATH, path.basename(previousPath[0].image));
    fs.unlink(removeImagePath, (err) => {});
  }

  if (fileData) {
    const { uploadedFile, path: _tmpPath } = fileData;
    const newPath = path.join(USER_IMAGE_PATH, uploadedFile.basename);
    fs.rename(_tmpPath, newPath, (err) => {});
  }
};

const updateEmail = async ({ id }, { email }) => {
  const userRows = await userDao.getUser(id);
  if (userRows.length === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }

  const [{ email: storedEmail }] = userRows;
  if (email !== storedEmail) {
    await userDao.updateEmail(id, email);
  }
};

const updateAccessToken = async ({ id }, { sns, accessToken }) => {
  const updateRows = await userDao.updateAccessToken(id, sns, accessToken);
  if (updateRows.affectedRows === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
};

const updatePushToken = async ({ id }, updateData) => {
  const updateRows = await userDao.updateUser(id, updateData);
  if (updateRows.affectedRows === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
};

const withdraw = async ({ id }, { email, password }) => {
  const previousPath = await userDao.getImage(id);
  const studyList = await studyDao.getMyStudy(id);
  if (studyList.length > 0) {
    throw customError(400, '가입한 스터디를 탈퇴하고 다시 시도하세요');
  }
  await userDao.withdraw(id, email, password);

  if (previousPath[0].image) {
    const removeImagePath = path.join(USER_IMAGE_PATH, path.basename(previousPath[0].image));
    fs.unlink(removeImagePath, (err) => {});
  }
};

const emailVerification = async ({ id }) => {
  const verifyRows = await userDao.verifiedCheck({ id });
  if (verifyRows.length === 0) {
    throw customError(404, '조회된 사용자가 없습니다');
  }
  if (verifyRows[0].email_verified === 1) {
    throw customError(400, `${verifyRows[0].email} 님은 이미 인증이 완료된 사용자입니다`);
  }
  await sendVerifyEmail(verifyRows[0].email);
};

const emailVerificationHandler = async ({ email }) => {
  const verifyRows = await userDao.verifiedCheck({ email });
  if (verifyRows.length === 0) {
    throw customError(404, '조회된 사용자가 없습니다', 201);
  } else if (verifyRows[0].email_verified === 1) {
    throw customError(400, `${verifyRows[0].email} 님은 이미 인증이 완료된 사용자입니다`, 202);
  }

  const [{ nickname }] = await userDao.emailVerificationHandler(email);
  return nickname;
};

const reissuance = async (expiredAccessToken, { refresh_token }) => {
  const { id } = getPayload(refresh_token);
  const refreshDecoded = verifyRefreshToken(refresh_token);
  if (refreshDecoded.err) {
    await logout({ id });
    throw customError(401, `refresh Token이 만료되었습니다. 다시 로그인 하세요`, 106);
  }

  const [userData] = await userDao.checkRefreshToken(refresh_token);
  if (!userData) {
    await logout({ id });
    throw customError(400, 'Refresh Token이 일치하지 않습니다. 다시 로그인 하세요', 101);
  }
  if (userData.access_token !== expiredAccessToken) {
    await logout({ id });
    throw customError(400, 'Access Token이 일치하지 않습니다. 다시 로그인 하세요', 102);
  }

  const newTokenSet = {
    access_token: getAccessToken(userData),
  };

  if (refreshDecoded.exp - Math.floor(new Date().getTime() / 1000) < process.env.JWT_refreshCycle) {
    newTokenSet.refresh_token = getRefreshToken(userData);
  }

  await userDao.updateUser(userData.id, newTokenSet);
  return newTokenSet;
};

const resetPassword = async ({ email }) => {
  await firebase
    .auth()
    .sendPasswordResetEmail(email)
    .catch((err) => {
      throw firebaseError(err);
    });
};

const getAddress = async () => {
  const addressRows = await userDao.getAddress();
  return parsingAddress(addressRows);
};

const pushTest = async ({ id: user_id }) => {
  push(PushEventEnum.push_test, 683, user_id);
};

module.exports = {
  checkNickname,
  checkEmail,
  logout,
  getUser,
  updateUser,
  updateUserImage,
  updateEmail,
  updateAccessToken,
  updatePushToken,
  withdraw,
  emailVerification,
  emailVerificationHandler,
  reissuance,
  resetPassword,
  getAddress,
  pushTest,
};
