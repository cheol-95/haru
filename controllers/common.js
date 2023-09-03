const commonService = require('../services/common');
const response = require('../utils/response');

const checkVersion = async (req, res) => {
  const result = await commonService.checkVersion(req.query);
  response(res, 200, result);
};

const getCalender = async (req, res) => {
  const calender = await commonService.getCalender(req.user);
  response(res, 200, { calender });
};

module.exports = {
  checkVersion,
  getCalender
};
