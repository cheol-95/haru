const applyDao = require('../dao/apply');
const commonService = require('./common');

const { push } = require('./push');

const { PushEventEnum, RedisEventEnum } = require('../utils/variables/enum');
const { rowSplit, toBoolean } = require('../utils/query');
const { customError } = require('../utils/errors/custom');
const { ApplyEnum } = require('../utils/variables/enum');
const { redisTrigger } = require('./redis');
const broadcast = require('../events/broadcast');

const createApply = async ({ user_id, study_id, message }) => {
  const createdRows = await applyDao.createApply({ user_id, study_id, message });
  if (createdRows.affectedRows === 0) {
    throw customError(404, '조회된 스터디가 없습니다');
  }
  push(PushEventEnum.apply_new, study_id);
};

const getApplyByUser = async ({ study_id, user_id }) => {
  const applyData = await applyDao.getApplyByUser(study_id, user_id);
  if (applyData.length === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
  return applyData[0];
};

const updateApply = async ({ id: user_id }, { apply_id, study_id }, updateData) => {
  const checkRows = await applyDao.applyCheck(user_id, study_id, apply_id);
  if (checkRows[0] && checkRows[0].apply_status !== ApplyEnum.apply) {
    throw customError(403, '이미 처리된 가입신청입니다');
  }

  const updateRows = await applyDao.updateApply(user_id, study_id, apply_id, updateData);
  if (updateRows.affectedRows === 0) {
    throw customError(404, '조회된 가입신청이 없습니다');
  }
};

const deleteApply = async ({ id: user_id }, { apply_id }) => {
  const deleteRows = await applyDao.deleteApply(user_id, apply_id);
  if (deleteRows.affectedRows === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
};

const getApplyById = async ({ study_id, apply_id }) => {
  let applyData = await applyDao.getApplyById(study_id, apply_id);
  if (applyData.length === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
  applyData = toBoolean(applyData, ['rejected_status']);
  return rowSplit(applyData, ['project']);
};

const applyListByHost = async ({ study_id }) => {
  const applyList = await applyDao.applyListByHost(study_id);
  return applyList;
};

const applyListByUser = async ({ id: user_id }) => {
  const applyList = await applyDao.applyListByUser(user_id);
  return applyList;
};

const applyHandler = async ({ study_id, apply_id }, { allow }) => {
  const userRows = await applyDao.getApplyById(study_id, apply_id);
  if (userRows.length === 0) {
    throw customError(404, '조회된 신청내역이 없습니다');
  }
  const { apply_status, user_id, nickname } = userRows[0];
  if (apply_status !== ApplyEnum.apply) {
    throw customError(400, '이미 처리된 회원입니다');
  }

  if (allow === true) {
    const allowRows = await applyDao.setAllow(study_id, apply_id, user_id);
    if (allowRows.affectedRows === 0) {
      throw customError(400, '가입 수락에 실패했습니다');
    }

    await commonService.setParticipateLog(study_id, user_id);
    redisTrigger(user_id, RedisEventEnum.participate, { study_id });
    push(PushEventEnum.apply_allow, study_id, user_id);
    broadcast.participate(study_id, nickname);
    broadcast.updateUserList(study_id);
  } else {
    const rejectRows = await applyDao.setReject(apply_id);
    if (rejectRows.affectedRows === 0) {
      throw customError(400, '거절 실패');
    }
    push(PushEventEnum.apply_reject, study_id, user_id);
  }
};

module.exports = {
  createApply,
  getApplyByUser,
  updateApply,
  deleteApply,
  getApplyById,
  applyListByHost,
  applyListByUser,
  applyHandler,
};
