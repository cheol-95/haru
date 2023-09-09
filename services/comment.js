const commentDao = require('../dao/comment');
const diaryDao = require('../dao/diary');
const { customError } = require('../utils/errors/custom');

const createComment = async ({ id: writeUserId }, { diaryId, comment }) => {
  const createRow = await commentDao.createComment(writeUserId, diaryId, comment);
  if (createRow.affectedRows === 0) {
    throw customError(500, '생성에 실패했습니다.');
  }
  const commentId = createRow.insertId
  return commentId;
};

const getComment = async ({ id: userId }, { id: commentId }) => {
  const commentRows = await commentDao.getComment(commentId);
  if (commentRows.length === 0) {
    throw customError(404, '조회된 코멘트가 없습니다.');
  }
  return commentRows[0];
};

const updateComment = async ({ id: writeUserId }, { id: commentId }, { comment }) => {
  const selectRows = await commentDao.getComment(commentId);
  if (selectRows.length === 0) {
    throw customError(404, '조회된 코멘트가 없습니다.');
  }

  const updateRow = await commentDao.updateComment(writeUserId, commentId, comment);
  if (updateRow.affectedRows === 0) {
    throw customError(500, '요청이 실패했습니다.');
  }

  return { id: +commentId, comment }
};

const likeComment = async ({ id: user_id }, { id: commentId }, { diaryId, is_like }) => {
  const diaryRows = await diaryDao.getDiaryById(diaryId);
  if (diaryRows.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }
  if (diaryRows[0].user_id !== user_id) {
    throw customError(401, '권한이 없습니다.');
  }
  
  const commentRows = await commentDao.getComment(commentId);
  if (commentRows.length === 0) {
    throw customError(404, '조회된 코멘트가 없습니다.');
  }

  const likeUpdateRow = await commentDao.likeComment(commentId, is_like);
  if (likeUpdateRow.affectedRows === 0) {
    throw customError(500, '요청이 실패했습니다.');
  }

  return { id: +commentId, is_like }
};

const deleteComment = async ({ id: writeUserId }, { id: commentId }) => {
  const selectRows = await commentDao.getComment(commentId);
  if (selectRows.length === 0) {
    throw customError(404, '조회된 코멘트가 없습니다.');
  }

  const deleteRows = await commentDao.deleteComment(commentId, writeUserId);
  if (deleteRows.length === 0) {
    throw customError(500, '요청이 실패했습니다.');
  }
};

const getCommentsOfDiary = async (diaryId) => {
  const selectRows = await commentDao.getCommentsOfDiary(diaryId);
  if (selectRows.length === 0) {
    throw customError(404, '조회된 다이어리가 없습니다.');
  }
  return selectRows;
}

module.exports = {
  createComment,
  getComment,
  updateComment,
  deleteComment,
  likeComment,
  getCommentsOfDiary,
};
