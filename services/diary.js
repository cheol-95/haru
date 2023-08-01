// const firebase = require('firebase');
const { parse, format, utcToZonedTime } = require('date-fns');


const diaryDao = require('../dao/diary');
const commentDao = require('../dao/comment');
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

const getCommentsOfDiary = async (diaryId) => {
  const comments = await commentDao.getCommentsOfDiary(diaryId);
  return comments.length > 0 ? comments: [];
}

const getDiary = async ({ id: user_id }, { id: diaryId }) => {
  const diaryRows = await diaryDao.getDiary(user_id, diaryId);
  if (diaryRows.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }
  const diary = diaryRows[0];
  diary.comments = await getCommentsOfDiary(diary.id);
  return diary;
};

const updateDiary = async ({ id: user_id }, { id: diaryId }, { content }) => {
  const selectRows = await diaryDao.getDiary(user_id, diaryId);
  if (selectRows.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }

  const updateRow = await diaryDao.updateDiary(diaryId, content);
  if (updateRow.affectedRows === 0) {
    throw customError(400, '업데이트에 실패했습니다.');
  }

  return { id: +diaryId, content }
};

const deleteDiary = async ({ id: user_id }, { id: diaryId }) => {
  const selectRows = await diaryDao.getDiary(user_id, diaryId);
  if (selectRows.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }

  const deleteRows = await diaryDao.deleteDiary(diaryId);
  if (deleteRows.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }
};

// TODO: 이거부터 만들고!
const convertDateRange = (date) => {
  const startTime = utcToZonedTime(parse(`${date} 00:00:00`, 'yyyy-MM-dd HH:mm:ss', new Date()), 'Asia/Seoul');
  const endTime = utcToZonedTime(parse(`${date} 23:59:59`, 'yyyy-MM-dd HH:mm:ss', new Date()), 'Asia/Seoul');

  return { 
    start: format(startTime, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' }),
    end: format(endTime, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' })
  };
}

// TODO: 이거 작업해야 함.
const getHaru = async ({ id: user_id }, { date }) => {
  const result = {
    todayDiary: 1, // optional
    yesterdayDiary: 2, // optional
    someoneYesterday: [3, 4, 5], // optional
    someoneToday: [5, 6, 7] // optional
  };
  
  const { start, end } = convertDateRange(date);
  
  const diaries = await diaryDao.getDiaryFromDate(user_id, start, end);
  if (diaries.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }
  for (const diary of diaries) {
    diary.comments = await getCommentsOfDiary(diary.id);
  }
    
  return diary;
};

module.exports = {
  createDiary,
  getDiary,
  updateDiary,
  deleteDiary,
  getHaru,
};
