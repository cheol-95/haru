const diaryService = require('../services/diary');
const response = require('../utils/response');
// const { makeAlert } = require('../utils/makeAlert');

const createDiary = async (req, res) => {
  const diaryId = await diaryService.createDiary(req.user, req.body);
  response(res, 200, { diaryId });
};

const getDiary = async (req, res) => {
  const diary = await diaryService.getDiary(req.user, req.params);
  response(res, 200, { diary });
};

module.exports = {
  createDiary,
  getDiary,
};
