const commonService = require('../services/common');
const response = require('../utils/response');

const checkVersion = async (req, res) => {
  const result = await commonService.checkVersion(req.query);
  response(res, 200, result);
};

module.exports = {
  checkVersion,
};
