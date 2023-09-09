const firebase = require('firebase');
const admin = require('firebase-admin');
const { toCamel, toSnake } = require ('snake-camel');

const pool = require('../configs/mysql');
const { customError } = require('../utils/errors/custom');
const { firebaseError } = require('../utils/errors/firebase');
const { databaseError } = require('../utils/errors/database');

const createComment = async (user_id, diaryId, comment) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const createSql = `
      INSERT INTO comment (write_user_id, diary_id, comment)
      VALUES (?, ?, ?);`
    const [createRow] = await conn.query(createSql, [user_id, diaryId, comment]);
    await conn.commit();
    return createRow;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getComment = async (commentId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const selectSql = `
      SELECT *
      FROM comment
      WHERE id = ?`;
    const [selectRows] = await conn.query(selectSql, [ commentId ]);
    await conn.commit();
    return selectRows;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const updateComment = async (writeUserId, commentId, comment) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sql = `
      UPDATE comment
      SET comment = ?
      WHERE id = ?
        AND write_user_id = ?`;
    const [createRow] = await conn.query(sql, [ comment, commentId, writeUserId ]);
    await conn.commit();
    return createRow;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const likeComment = async (commentId, is_like) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sql = `
      UPDATE comment
      SET is_like = ?
      WHERE id = ?`;
    const [createRow] = await conn.query(sql, [ is_like, commentId ]);
    await conn.commit();
    return createRow;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const deleteComment = async (commentId, writeUserId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sql = `
      DELETE FROM comment
      WHERE id = ?
        AND write_user_id = ?`;
    const [createRow] = await conn.query(sql, [commentId, writeUserId]);
    await conn.commit();
    return createRow;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};


const getCommentsOfDiary = async (diaryId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sql = `
      SELECT diary_id, write_user_id, comment, is_like
      FROM comment
      WHERE diary_id = ?`;
    const [rows] = await conn.query(sql, [ diaryId ]);
    await conn.commit();
    return rows;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

module.exports = {
  createComment,
  getComment,
  updateComment,
  deleteComment,
  getCommentsOfDiary,
  likeComment,
};
