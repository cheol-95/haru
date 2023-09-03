// const firebase = require('firebase');
const { subDays, set, format } = require('date-fns');

const diaryDao = require('../dao/diary');
const commentDao = require('../dao/comment');
// const { toBoolean, parsingAddress } = require('../utils/query');
// const { verifyRefreshToken, getAccessToken, getRefreshToken, getPayload } = require('../utils/jwt.js');
const { customError } = require('../utils/errors/custom');
// const { firebaseError } = require('../utils/errors/firebase');
// const { push } = require('./push');

// const { RedisEventEnum, PushEventEnum } = require('../utils/variables/enum');

const ensureFirstCreateDiary = async (user_id) => {
  const { start, end } = convertDateRange(new Date())
  const diary = await diaryDao.getDiaryFromDate(user_id, start, end);
  if (diary.length) {
    throw customError(400, '오늘은 이미 다이어리를 작성했어요');
  }
}

const createDiary = async ({ id: user_id }, { content }) => {
  await ensureFirstCreateDiary(user_id);

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

// UTC로 리턴함
const convertDateRange = (date) => {
  const todayStartUTC = set(date, { hours: 15, minutes: 0, seconds: 0 });
  const yesterdayStartUTC = subDays(todayStartUTC, 1);
  const todayEndUTC = set(date, { hours: 14, minutes: 59, seconds: 59 });

  const start = format(yesterdayStartUTC, 'yyyy-MM-dd HH:mm:ss');
  const end = format(todayEndUTC, 'yyyy-MM-dd HH:mm:ss');
  return { start, end };
}

// TODO: 이거 작업해야 함.
const getHaru = async ({ id: user_id }, { date }) => {
  console.log('\n\n ## getHaru',);
  console.log('date: ', date);
  const result = {
    today_diary_id: 1, // optional
    yesterday_diary_id: 2, // optional
    
    someone_yesterday_ids: [3, 4, 5], // optional
    someone_today_ids: [5, 6, 7] // optional
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