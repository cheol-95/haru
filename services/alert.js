const alertDao = require('../dao/alert');
const { toBoolean } = require('../utils/query');
const { customError } = require('../utils/errors/custom');
const { redisTrigger } = require('./redis');
const { RedisEventEnum } = require('../utils/variables/enum');

const getAlert = async ({ id: user_id }) => {
  const alertRows = await alertDao.getAlert(user_id);
  return toBoolean(alertRows, ['confirm']);
};

const confirmAlert = async ({ id: user_id }, { alert_id }) => {
  const [confirmRows, studyRows] = await alertDao.confirmAlert(alert_id);
  if (confirmRows.affectedRows === 0) {
    throw customError(404, '알림을 찾을 수 없습니다');
  }
  await redisTrigger(user_id, RedisEventEnum.alert_read, { study_id: studyRows[0].study_id });
};

module.exports = {
  getAlert,
  confirmAlert,
};
