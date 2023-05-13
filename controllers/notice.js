const noticeService = require('../services/notice');
const { isHost, checkAuthority } = require('../services/common');
const response = require('../utils/response');
const { AuthEnum } = require('../utils/variables/enum');

const createNotice = async (req, res) => {
  await isHost(req.user, req.params);
  const notice_id = await noticeService.createNotice(req.user, req.params, req.body);
  response(res, 201, { notice_id });
};

const getNotice = async (req, res) => {
  const noticeData = await noticeService.getNotice(req.params);
  response(res, 200, noticeData);
};

const updateNotice = async (req, res) => {
  await isHost(req.user, req.params);
  await noticeService.updateNotice(req.user, req.params, req.body);
  response(res, 200, '공지사항이 수정되었습니다');
};

const deleteNotice = async (req, res) => {
  await isHost(req.user, req.params);
  await noticeService.deleteNotice(req.params);
  response(res, 200, '공지사항이 삭제되었습니다');
};

const getNoticeList = async (req, res) => {
  await checkAuthority(req.user, req.params, AuthEnum.host, AuthEnum.member);
  const getNoticeList = await noticeService.getNoticeList(req.params);
  response(res, 200, getNoticeList);
};

const noticePaging = async (req, res) => {
  // const noticeKeys = Array.from({ length: process.env.paging_size });
  const noticeKeys = Array.from({ length: 5 });
  for (const [key, value] of Object.entries(req.query.values.split(','))) {
    noticeKeys[key] = value;
  }

  const studyList = await noticeService.noticePaging(noticeKeys);
  response(res, 200, studyList);
};

module.exports = {
  createNotice,
  getNotice,
  updateNotice,
  deleteNotice,
  getNoticeList,
  noticePaging,
};
