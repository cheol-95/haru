const adminService = require('../services/admin');
const response = require('../utils/response');

const resetRedis = async (req, res) => {
  await adminService.resetRedis();
  response(res, 200, '레디스 초기화 완료');
};

const getRedis = async (req, res) => {
  const userData = await adminService.getRedis(req.params);
  response(res, 200, userData);
};

const deleteEmptyStudy = async (req, res) => {
  await adminService.deleteEmptyStudy();
  response(res, 200, '유저 없는 스터디 제거 완료');
};

const setVersion = async (req, res) => {
  await adminService.setVersion(req.body);
  response(res, 200, '버전 설정 완료');
};

const deleteStudy = async (req, res) => {
  await adminService.deleteStudy(req.params);
  response(res, 200, '스터디 삭제 완료');
};

const setParticipate_log = async (req, res) => {
  await adminService.setParticipate_log();
  response(res, 200, '스터디 참여자 세팅완료');
};

module.exports = {
  resetRedis,
  getRedis,
  deleteEmptyStudy,
  setVersion,
  deleteStudy,
  setParticipate_log,
};
