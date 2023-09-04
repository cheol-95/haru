// const firebase = require('firebase');
const { subDays, set, format } = require('date-fns');

const diaryDao = require('../dao/diary');
const commentDao = require('../dao/comment');
const otherDiaryDao = require('../dao/otherDiary');
// const { toBoolean, parsingAddress } = require('../utils/query');
// const { verifyRefreshToken, getAccessToken, getRefreshToken, getPayload } = require('../utils/jwt.js');
const { customError } = require('../utils/errors/custom');
// const { firebaseError } = require('../utils/errors/firebase');
// const { push } = require('./push');

// const { RedisEventEnum, PushEventEnum } = require('../utils/variables/enum');

const ensureFirstCreateDiary = async (user_id) => {
  const [start, end] = convertDateRange(new Date())
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

const convertDateRange = (date) => {
  const todayStartUTC = set(date, { hours: 15, minutes: 0, seconds: 0 });
  const yesterdayStartUTC = subDays(todayStartUTC, 1);
  const todayEndUTC = set(date, { hours: 14, minutes: 59, seconds: 59 });

  const start = format(yesterdayStartUTC, 'yyyy-MM-dd HH:mm:ss');
  const end = format(todayEndUTC, 'yyyy-MM-dd HH:mm:ss');
  return [start, end];
}

const getHaru = async ({ id: user_id }, { date }) => {
  const today = new Date(date);
  const yesterday = subDays(today, 1);
  
  const [todayDiary, yesterdayDiary, todayOtherDiary, yesterdayOtherDiary] = await Promise.all([
    diaryDao.getDiaryFromDate(user_id, ...convertDateRange(today)),
    diaryDao.getDiaryFromDate(user_id, ...convertDateRange(yesterday)),
    otherDiaryDao.getOtherDiariesFromDate(user_id, ...convertDateRange(today)),
    otherDiaryDao.getOtherDiariesFromDate(user_id, ...convertDateRange(yesterday)),
  ])

  return {
    me: {
      today_diary: todayDiary,
      yesterday_diary: yesterdayDiary,
    },
    someone: {
      today_diaries: todayOtherDiary,
      yesterday_diaries: yesterdayOtherDiary,
    }
  }
};

module.exports = {
  createDiary,
  getDiary,
  updateDiary,
  deleteDiary,
  getHaru,
};