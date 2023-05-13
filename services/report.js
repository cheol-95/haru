const reportDao = require('../dao/report');
const studyDao = require('../dao/study');
const { customError } = require('../utils/errors/custom');

const createReport = async ({ id: user_id }, { study_id }, { message }) => {
  const studyRows = await studyDao.getStudy(study_id);
  if (studyRows.length === 0) {
    throw customError(404, '조회된 스터디가 없습니다');
  }

  const reportRows = await reportDao.createReport({ study_id, user_id, message });
  if (reportRows.affectedRows === 0) {
    throw customError(400, '신고하기가 실패했습니다');
  }
};

module.exports = {
  createReport,
};
