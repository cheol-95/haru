// const commonDao = require('../dao/common');
const diaryDao = require('../dao/diary');

const getCalender = async ({ id: user_id }) => {
  const diaries = await diaryDao.getDiaryByUserId(user_id);
  if (diaries.length === 0) {
    throw customError(404, '작성한 다이어리가 없습니다');
  }
  return diaries.map(({ created_at })=> created_at);
};


module.exports = {
  getCalender,
};
