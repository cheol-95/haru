const reportService = require('../services/report');
const response = require('../utils/response');

const createReport = async (req, res) => {
  await reportService.createReport(req.user, req.params, req.body);
  response(res, 201, '신고가 완료되었습니다');
};

module.exports = {
  createReport,
};
