const commonDao = require('../dao/common');

const { authError } = require('../utils/errors/auth');
const { AuthEnum, ApplyEnum, VersionUpdateEnum } = require('../utils/variables/enum');

const isHost = async ({ id: user_id }, { study_id }) => {
  const checkRows = await commonDao.isHost(user_id, study_id);
  if (checkRows[0].isHost === 0) {
    throw authError({ message: 'permission error' });
  }
};

const checkAuth = async ({ id: user_id }, { study_id }) => {
  const memberCheckRows = await commonDao.checkMember(user_id, study_id);
  if (memberCheckRows.length === 1) {
    return AuthEnum[memberCheckRows[0].leader == true ? AuthEnum.host : AuthEnum.member];
  }

  const applyCheckRows = await commonDao.checkApply(user_id, study_id);
  if (applyCheckRows.length >= 1) {
    return AuthEnum[applyCheckRows[0].apply_status === ApplyEnum.apply ? AuthEnum.applier : AuthEnum.reject];
  }

  return AuthEnum.none;
};

const checkAuthority = async ({ id: user_id }, { study_id }, ...authority) => {
  const status = await checkAuth({ id: user_id }, { study_id });
  if (authority.indexOf(status) === -1) {
    throw authError({ message: 'permission error' });
  }
  return status;
};

const checkVersion = async ({ version, device }) => {
  const result = {
    force: VersionUpdateEnum.should,
    maintenance: Boolean(process.env.MAINTENANCE === 'true'),
  };

  const versionRows = await commonDao.checkVersion(version, device);
  if (versionRows.length === 0) {
    result.force = VersionUpdateEnum.none;
  }

  versionRows.forEach((row) => {
    if (row.force === 1) {
      result.force = VersionUpdateEnum.must;
    }
  });

  result.latest_version = versionRows[0] ? versionRows.slice(-1)[0].version : null;
  return result;
};

const setParticipateLog = async (study_id, user_id) => {
  const participateLogRows = await commonDao.getParticipateLog(study_id);

  const insertedStatus = participateLogRows.reduce((acc, { user_id: id }) => {
    return user_id === id ? acc + 1 : acc;
  }, 0);

  if (insertedStatus === 0) {
    await commonDao.setParticipateLog(study_id, user_id);
  }
};

module.exports = {
  isHost,
  checkAuth,
  checkAuthority,
  checkVersion,
  setParticipateLog,
};
