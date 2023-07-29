const firebase = require('firebase');
const admin = require('firebase-admin');
const { toCamel, toSnake } = require ('snake-camel');

const pool = require('../configs/mysql');
const { customError } = require('../utils/errors/custom');
const { firebaseError } = require('../utils/errors/firebase');
const { databaseError } = require('../utils/errors/database');

const getDiary = async (user_id, diaryId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const selectSql = `
      SELECT *
      FROM diary
      WHERE user_id = ?
        AND id = ?`;
    const [selectRows] = await conn.query(selectSql, [ user_id, diaryId ]);
    await conn.commit();
    return selectRows;
  } catch (err) {
    await conn.rollback();
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

const getDiaryFromDate = async (user_id, { start, end }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const selectSql = `
      SELECT *
      FROM diary
      WHERE user_id = ?
        AND created_at BETWEEN ? AND ?`;
    const [selectRows] = await conn.query(selectSql, [ user_id, start, end ]);
    await conn.commit();
    return selectRows;
  } catch (err) {
    await conn.rollback();
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};


module.exports = {
  getDiary,
  createDiary,
  updateDiary,
  deleteDiary,
  getDiaryFromDate,
};
