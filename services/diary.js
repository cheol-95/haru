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

const ensureFirstCreateDiary = async (userId) => {
  const [start, end] = convertDateRange(new Date())
  const diary = await diaryDao.getDiaryFromDate(userId, start, end);
  if (diary.length) {
    throw customError(400, '오늘은 이미 다이어리를 작성했어요');
  }
}

const createDiary = async ({ id: userId }, { content }) => {
  await ensureFirstCreateDiary(userId);

  const createRow = await diaryDao.createDiary({ userId, content });
  if (createRow.affectedRows === 0) {
    throw customError(500, '생성에 실패했습니다.');
  }
  const diaryId = createRow.insertId
  return diaryId;
};

const getCommentsOfDiary = async (diaryId) => {
  const comments = await commentDao.getCommentsOfDiary(diaryId);
  return comments.length > 0 ? comments: [];
}

const getDiary = async ({ id: userId }, { id: diaryId }) => {
  const diaryRows = await diaryDao.getDiary(userId, diaryId);
  if (diaryRows.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }
  const diary = diaryRows[0];
  diary.comments = await getCommentsOfDiary(diary.id);
  return diary;
};

const updateDiary = async ({ id: userId }, { id: diaryId }, { content }) => {
  const selectRows = await diaryDao.getDiary(userId, diaryId);
  if (selectRows.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }

  const updateRow = await diaryDao.updateDiary(diaryId, content);
  if (updateRow.affectedRows === 0) {
    throw customError(500, '업데이트에 실패했습니다.');
  }

  return { id: +diaryId, content }
};

const deleteDiary = async ({ id: userId }, { id: diaryId }) => {
  const selectRows = await diaryDao.getDiary(userId, diaryId);
  if (selectRows.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }

  const deleteRows = await diaryDao.deleteDiary(diaryId);
  if (deleteRows.length === 0) {
    throw customError(500, '삭제 실패했습니다.');
  }
};

const likeDiary = async ({ id: userId }, { id: diaryId }, { is_like }) => {
  const diaryRows = await diaryDao.getDiaryById(diaryId); // 다이어리 삭제 규정 검토해야함
  if (diaryRows.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }

  const updateRow = await diaryDao.likeOtherDiary(userId, diaryId, is_like);
  if (updateRow.affectedRows === 0) {
    throw customError(500, '업데이트에 실패했습니다.');
  }
  await diaryDao.updateLikeCount(diaryId);
};

const convertDateRange = (date) => {
  const todayStartUTC = set(date, { hours: 15, minutes: 0, seconds: 0 });
  const yesterdayStartUTC = subDays(todayStartUTC, 1);
  const todayEndUTC = set(date, { hours: 14, minutes: 59, seconds: 59 });

  const start = format(yesterdayStartUTC, 'yyyy-MM-dd HH:mm:ss');
  const end = format(todayEndUTC, 'yyyy-MM-dd HH:mm:ss');
  return [start, end];
}

const getHaru = async ({ id: userId }, { date }) => {
  const today = new Date(date);
  const yesterday = subDays(today, 1);
  
  const [
    todayDiary,
    yesterdayDiary,
    todayOtherDiary,
    yesterdayOtherDiary
  ] = await Promise.all([
    diaryDao.getDiaryFromDate(userId, ...convertDateRange(today)),
    diaryDao.getDiaryFromDate(userId, ...convertDateRange(yesterday)),
    otherDiaryDao.getOtherDiariesFromDate(userId, ...convertDateRange(today)),
    otherDiaryDao.getOtherDiariesFromDate(userId, ...convertDateRange(yesterday)),
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
  likeDiary,
  getHaru,
};