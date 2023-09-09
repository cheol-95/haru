const firebase = require('firebase');
const admin = require('firebase-admin');
const { toCamel, toSnake } = require ('snake-camel');

const pool = require('../configs/mysql');
const { customError } = require('../utils/errors/custom');
const { firebaseError } = require('../utils/errors/firebase');
const { databaseError } = require('../utils/errors/database');

const getDiary = async (userId, diaryId) => {
  const conn = await pool.getConnection();
  try {
    const sql = `
      SELECT *
      FROM diary
      WHERE user_id = ?
        AND id = ?`;
    const [selectRows] = await conn.query(sql, [ userId, diaryId ]);
    return selectRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getDiaryById = async (diaryId) => {
  const conn = await pool.getConnection();
  try {
    const sql = `
      SELECT *
      FROM diary
      WHERE id = ?`;
    const [selectRows] = await conn.query(sql, [ diaryId ]);
    return selectRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getDiaryByUserId = async (userId) => {
  const conn = await pool.getConnection();
  try {
    const sql = `
      SELECT *
      FROM diary
      WHERE user_id = ?`;
    const [diaryRows] = await conn.query(sql, [ userId ]);
    return diaryRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const createDiary = async (createData) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const createSql = `
      INSERT INTO diary
      SET ?`;
    const [createRow] = await conn.query(createSql, [createData]);
    await conn.commit();
    return createRow;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const updateDiary = async (diaryId, content) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sql = `
      UPDATE diary
      SET content = ?
      WHERE id = ?`;
    const [createRow] = await conn.query(sql, [content, diaryId]);
    await conn.commit();
    return createRow;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const deleteDiary = async (diaryId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sql = `
      DELETE FROM diary
      WHERE id = ?`;
    const [createRow] = await conn.query(sql, [diaryId]);
    await conn.commit();
    return createRow;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const likeOtherDiary = async (userId, diaryId, is_like) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const sql = `
      UPDATE user_other_diary
      SET is_like = ?
      WHERE diary_id = ?
        AND user_id = ?`;
    const [updateRow] = await conn.query(sql, [is_like, diaryId, userId]);
    await conn.commit();
    return updateRow;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const updateLikeCount = async (diaryId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const likeCountSql = `
      SELECT count(id) as cnt
      FROM user_other_diary
      WHERE diary_id = ?
        AND is_like = true`;
    const [likeCountSqlRow] = await conn.query(likeCountSql, [diaryId]);
    const { cnt: likeCount } = likeCountSqlRow[0];

    const sql = `
      UPDATE diary
      SET like_count = ?
      WHERE id = ?`;
    const [updateRow] = await conn.query(sql, [likeCount, diaryId]);
    await conn.commit();
    return updateRow;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getDiaryFromDate = async (userId, start, end) => {
  const conn = await pool.getConnection();
  try {
    const selectSql = `
      SELECT *
      FROM diary
      WHERE user_id = ?
        AND created_at BETWEEN ? AND ?`;
    const [selectRows] = await conn.query(selectSql, [ userId, start, end ]);
    return selectRows.length ? selectRows[0] : null;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};


module.exports = {
  getDiary,
  getDiaryById,
  getDiaryByUserId,
  createDiary,
  updateDiary,
  deleteDiary,
  likeOtherDiary,
  updateLikeCount,
  getDiaryFromDate,
};
