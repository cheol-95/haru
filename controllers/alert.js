const alertService = require('../services/alert');
const response = require('../utils/response');

const getAlert = async (req, res) => {
  const alertList = await alertService.getAlert(req.params);
  response(res, 200, alertList);
};

const confirmAlert = async (req, res) => {
  await alertService.confirmAlert(req.user, req.params);
  response(res, 200, '알림 읽음처리 완료');
};

module.exports = {
  getAlert,
  confirmAlert,
};
