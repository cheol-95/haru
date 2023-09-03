// const firebase = require('firebase');

const commentDao = require('../dao/comment');
// const { toBoolean, parsingAddress } = require('../utils/query');
// const { verifyRefreshToken, getAccessToken, getRefreshToken, getPayload } = require('../utils/jwt.js');
const { customError } = require('../utils/errors/custom');
// const { firebaseError } = require('../utils/errors/firebase');
// const { push } = require('./push');

// const { RedisEventEnum, PushEventEnum } = require('../utils/variables/enum');


const getCommentsOfDiary = async (diaryId) => {
  const selectRows = await commentDao.getCommentsOfDiary(diaryId);
  if (selectRows.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }
  return selectRows;
}

module.exports = {
  getCommentsOfDiary
};
