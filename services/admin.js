const adminDao = require('../dao/admin');
const studyDao = require('../dao/study');

const studyService = require('./study');

const { authError } = require('../utils/errors/auth');
const { customError } = require('../utils/errors/custom');
const { RedisEventEnum } = require('../utils/variables/enum');
const { redisTrigger, getUser } = require('./redis');

const resetRedis = async () => {
  let study_list = [];
  const userRows = await adminDao.getUserList();

  await userRows.forEach(async (user) => {
    study_list = await adminDao.getUserStudyList(user.id);
    await redisTrigger(user.id, RedisEventEnum.reset, study_list);
  });
};

const getRedis = async ({ user_id }) => {
  return await getUser(user_id);
};

const deleteEmptyStudy = async () => {
  await adminDao.deleteEmptyStudy();
};

const setVersion = async (versionData) => {
  const versionRows = await adminDao.setVersion(versionData);
  if (versionRows.affectedRows === 0) {
    throw customError(400, '버전 설정에 실패했습니다');
  }
};

const deleteStudy = async ({ study_id }) => {
  const studyRows = await studyDao.getStudy(study_id);
  if (studyRows.length === 0) {
    throw customError(404, '조회된 스터디가 없습니다');
  }
  const host_id = studyRows[0].Puser_id;
  await studyService.deleteStudy({ id: host_id }, { study_id });
};

const setParticipate_log = async () => {
  const participateRows = await adminDao.getParticipate();

  for (const participate of participateRows) {
    await adminDao.setParticipateLog(participate);
  }
};

module.exports = {
  resetRedis,
  getRedis,
  deleteEmptyStudy,
  setVersion,
  deleteStudy,
  setParticipate_log,
};
