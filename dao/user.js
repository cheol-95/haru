const firebase = require('firebase');
const admin = require('firebase-admin');
const { toCamel, toSnake } = require ('snake-camel');

const pool = require('../configs/mysql');
const { customError } = require('../utils/errors/custom');
const { firebaseError } = require('../utils/errors/firebase');
const { databaseError } = require('../utils/errors/database');

const checkNickname = async (nickname, user_id) => {
  const conn = await pool.getConnection();
  user_id = user_id ? user_id : 0;
  try {
    const checkSql = `
      SELECT nickname
      FROM user
      WHERE nickname = ?
        AND NOT id = ?`;
    const [checkRows] = await conn.query(checkSql, [nickname, user_id]);
    return checkRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const checkEmail = async (email) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = `
      SELECT email
      FROM user
      WHERE email = ?`;
    const [checkRows] = await conn.query(checkSql, [email]);
    return checkRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const login = async (sns, snsId, email, nickname, accessToken) => {
  const conn = await pool.getConnection();
  let userId = null;
  try {
    conn.beginTransaction();

    /**
     * 1. email, sns, sns_id 조인 걸어서 있으면  -> user, sns 업데이트
     * 2. email O / sns, sns_id X           -> user 업데이트, sns 생성
     * 3. email X / sns, sns_id X           -> user, sns 생성
     */
    const findSnsSql = `
      SELECT user_id
      FROM sns
      WHERE sns = ?
        AND sns_id = ?`;
    const [findSnsRows] = await conn.query(findSnsSql, [ sns, snsId ]);

    const findEmailSql = `
      SELECT id as user_id
      FROM user
      WHERE email = ?`;
    const [findEmailRows] = await conn.query(findEmailSql, [ email ]);

    if (findSnsRows.length === 0 && findEmailRows.length === 0 ) {
      const signupSql = `
        INSERT INTO user
        SET ?`;
      const [signupRows] = await conn.query(signupSql, { email });
      userId = signupRows.insertId;
    } else {
      userId = findSnsRows.length > 0 ? findSnsRows[0].user_id : findEmailRows[0].user_id;
    }
    
    if (userId === 0) throw new Error('SYSTEM ERROR')

    const snsSql = `
      INSERT INTO sns (user_id, sns, sns_id, access_token)
      VALUES (?, ?, ?, ?) ON DUPLICATE KEY
      UPDATE access_token = ?`;
    await conn.query(snsSql, [userId, sns, snsId, accessToken, accessToken]);

    conn.commit();
    return userId;
  } catch (err) {
    conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getUser = async (id) => {
  const conn = await pool.getConnection();
  try {
    const userSql = `
      SELECT 
        id, nickname, email, image, introduce, sido, sigungu, career_title, career_contents, sns_github, sns_linkedin, sns_web, email_verified,
        UNIX_TIMESTAMP(created_at) as created_at
      FROM user 
      WHERE id = ?`;
    const [userData] = await conn.query(userSql, [id]);
    return userData;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const updateUser = async (id, updateData) => {
  const conn = await pool.getConnection();
  try {
    const updateSql = `
      UPDATE user
      SET ?
      WHERE id = ?`;
    const [updateRows] = await conn.query(updateSql, [toSnake(updateData), [id]]);
    return updateRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const logout = async (id) => {
  const conn = await pool.getConnection();
  try {
    const flushPushTokenSql = `
      UPDATE user
      SET push_token = ''
      WHERE id = ?`;
    await conn.query(flushPushTokenSql, [id]);
    const flushAccessTokenSql = `
      UPDATE sns
      SET access_token = ''
      WHERE user_id = ?`;
    await conn.query(flushAccessTokenSql, [id]);
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const updateAccessToken = async (id, sns, accessToken) => {
  const conn = await pool.getConnection();
  try {
    const updateSql = `
      UPDATE sns
      SET access_token = ?
      WHERE user_id = ?
        AND sns = ?`;
    const [updateRows] = await conn.query(updateSql, [accessToken, id, sns]);
    return updateRows;
  } catch (err) {
    console.log('err: ', err);
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const withdraw = async (id, email, password) => {
  const conn = await pool.getConnection();
  try {
    conn.beginTransaction();

    const withdrawSql = `
      DELETE FROM user
      WHERE id = ?
        AND BINARY email = ?`;
    const [withdrawRows] = await conn.query(withdrawSql, [id, email]);

    if (!withdrawRows.affectedRows) {
      throw customError(404, '조회된 사용자가 없습니다');
    }
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        const user = firebase.auth().currentUser;
        user.delete();
      })
      .catch((err) => {
        throw firebaseError(err);
      });
    conn.commit();
    return withdrawRows;
  } catch (err) {
    conn.rollback();
    throw err;
  } finally {
    await conn.release();
  }
};

const verifiedCheck = async (userData) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = `
      SELECT email, email_verified
      FROM user
      WHERE ?`;
    const [checkRows] = await conn.query(checkSql, userData);
    return checkRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const emailVerificationHandler = async (email) => {
  const conn = await pool.getConnection();
  try {
    const uidSql = `
      SELECT uid
      FROM user
      WHERE BINARY email =?`;
    const [uidRows] = await conn.query(uidSql, [email]);
    const result = admin
      .auth()
      .updateUser(uidRows[0].uid, {
        emailVerified: true,
      })
      .then(async () => {
        const updateSql = `
          UPDATE user
          SET email_verified = ?
          WHERE BINARY email = ?`;
        await conn.query(updateSql, [true, email]);

        const userSql = `
          SELECT nickname
          FROM user
          WHERE BINARY email = ?`;
        const [userRows] = await conn.query(userSql, [email]);
        return userRows;
      })
      .catch((err) => {
        throw firebaseError(err);
      });
    return result;
  } catch (err) {
    if (err.status) {
      throw firebaseError(err);
    } else {
      throw databaseError(err);
    }
  } finally {
    await conn.release();
  }
};

const checkRefreshToken = async (refreshToken) => {
  const conn = await pool.getConnection();
  try {
    const checkSql = `
      SELECT id, email, nickname, access_token
      FROM user
      WHERE refresh_token = ?`;
    const [checkRows] = await conn.query(checkSql, [refreshToken]);
    return checkRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const updateEmail = async (id, email) => {
  const conn = await pool.getConnection();
  try {
    conn.beginTransaction();
    const uidSql = `
      SELECT uid
      FROM user
      WHERE id = ?`;
    const [uidRows] = await conn.query(uidSql, [id]);
    const { uid } = uidRows[0];

    await admin
      .auth()
      .updateUser(uid, {
        email,
        emailVerified: false,
      })
      .catch((err) => {
        throw firebaseError(err);
      });

    const updateSql = `
      UPDATE user
      SET ?
      WHERE id = ?`;
    const [updateRows] = await conn.query(updateSql, [{ email, email_verified: false }, id]);

    conn.commit();
    return updateRows;
  } catch (err) {
    conn.rollback();
    if (err.status) {
      throw err;
    }
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getAddress = async () => {
  const conn = await pool.getConnection();
  try {
    const addressSql = `
      SELECT *
      FROM address`;
    const [addressRows] = await conn.query(addressSql);
    return addressRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const clearPushToken = async (pushToken) => {
  const conn = await pool.getConnection();
  try {
    const clearSql = `
      UPDATE user
      SET push_token = ?
      WHERE push_token = ?`;
    await conn.query(clearSql, ['', pushToken]);
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

module.exports = {
  // signup,
  login,
  logout,
  getUser,
  updateUser,
  checkNickname,
  checkEmail,
  withdraw,
  verifiedCheck,
  emailVerificationHandler,
  checkRefreshToken,
  updateEmail,
  getAddress,
  clearPushToken,
  updateAccessToken,
};
