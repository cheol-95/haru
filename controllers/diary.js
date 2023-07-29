const diaryService = require('../services/diary');
const diaryService = require('../services/diary');
const response = require('../utils/response');
// const { makeAlert } = require('../utils/makeAlert');

const getDiary = async (req, res) => {
  const diary = await diaryService.getDiary(req.user, req.params);
  response(res, 200, { diary });
};

const createDiary = async (req, res) => {
  const diaryId = await diaryService.createDiary(req.user, req.body);
  response(res, 200, { diaryId });
};

const updateDiary = async (req, res) => {
  const diary = await diaryService.updateDiary(req.user, req.params, req.body);
  response(res, 200, { diary });
}

const deleteDiary = async (req, res) => {
  await diaryService.deleteDiary(req.user, req.params);
  response(res, 200);
}

const getHaru = async (req, res) => {
  const haru = await diaryService.getHaru(req.user, req.body);
  response(res, 200, { haru });
};

module.exports = {
  getDiary,
  createDiary,
  updateDiary,
  deleteDiary,
  getHaru,
};
