// const firebase = require('firebase');

const diaryDao = require('../dao/diary');
// const { toBoolean, parsingAddress } = require('../utils/query');
// const { verifyRefreshToken, getAccessToken, getRefreshToken, getPayload } = require('../utils/jwt.js');
const { customError } = require('../utils/errors/custom');
// const { firebaseError } = require('../utils/errors/firebase');
// const { push } = require('./push');

// const { RedisEventEnum, PushEventEnum } = require('../utils/variables/enum');

const createDiary = async ({ id: user_id }, { content }) => {
  const createRow = await diaryDao.createDiary({ user_id, content });
  if (createRow.affectedRows === 0) {
    throw customError(400, '생성에 실패했습니다.');
  }
  const diaryId = createRow.insertId
  return diaryId;
};

const getDiary = async ({ id: user_id }, { id: diaryId }) => {
  const selectRows = await diaryDao.getDiary(user_id, diaryId);
  if (selectRows.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }
  return selectRows[0];
};

module.exports = {
  createDiary,
  getDiary,
};
