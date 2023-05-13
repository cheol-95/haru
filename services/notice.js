const noticeDao = require('../dao/notice');

const { toBoolean, cutId } = require('../utils/query');
const { customError } = require('../utils/errors/custom');
const { PushEventEnum } = require('../utils/variables/enum');
const { push } = require('./push');

const createNotice = async ({ id: user_id }, { study_id }, createData) => {
  const newNotice = await noticeDao.createNotice({ ...createData, user_id, study_id });
  if (newNotice.affectedRows === 0) {
    throw customError(404, '조회된 스터디가 없습니다');
  }

  push(PushEventEnum.notice_new, study_id);
  return newNotice.insertId;
};

const getNotice = async ({ study_id, notice_id }) => {
  let noticeRows = await noticeDao.getNotice(study_id, notice_id);
  if (noticeRows.length === 0) {
    throw customError(404, '조회된 공지사항이 없습니다');
  }
  noticeRows = toBoolean(noticeRows, ['pinned']);
  return noticeRows[0];
};

const updateNotice = async ({ id: user_id }, { study_id, notice_id }, updateData) => {
  const updateRows = await noticeDao.updateNotice(study_id, notice_id, { ...updateData, user_id });
  if (updateRows.affectedRows === 0) {
    throw customError(404, '조회된 공지사항이 없습니다');
  }

  push(PushEventEnum.notice_update, study_id);
};

const deleteNotice = async ({ study_id, notice_id }) => {
  const deleteRows = await noticeDao.deleteNotice(study_id, notice_id);
  if (deleteRows.affectedRows === 0) {
    throw customError(404, '조회된 공지사항이 없습니다');
  }
};

const getNoticeList = async ({ study_id }) => {
  let noticeRows = await noticeDao.getNoticeList(study_id);
  noticeRows = toBoolean(noticeRows, ['pinned']);
  return cutId(noticeRows);
};

const noticePaging = async (noticeKeys) => {
  const noticeRows = await noticeDao.noticePaging(noticeKeys);
  return toBoolean(noticeRows, ['pinned']);
};

module.exports = {
  createNotice,
  getNotice,
  getNoticeList,
  updateNotice,
  deleteNotice,
  noticePaging,
};
