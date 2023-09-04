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
    const sql = `
      SELECT *
      FROM diary
      WHERE user_id = ?
        AND id = ?`;
    const [selectRows] = await conn.query(sql, [ user_id, diaryId ]);
    return selectRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getDiaryByUserId = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const sql = `
      SELECT *
      FROM diary
      WHERE user_id = ?`;
    const [diaryRows] = await conn.query(sql, [ user_id ]);
    
    // const sql_ = `SELECT @@global.time_zone;`
    // const [diaryRows_] = await conn.query(sql_, [ user_id ]);
    // console.log('diaryRows_: ', diaryRows_);
    
    // const sql__ = `SELECT @@session.time_zone;`;
    // const [diaryRows__] = await conn.query(sql__, [ user_id ]);
    // console.log('diaryRows__: ', diaryRows__);

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

const getDiaryFromDate = async (user_id, start, end) => {
  const conn = await pool.getConnection();
  try {
    const selectSql = `
      SELECT *
      FROM diary
      WHERE user_id = ?
        AND created_at BETWEEN ? AND ?`;
    const [selectRows] = await conn.query(selectSql, [ user_id, start, end ]);
    return selectRows.length ? selectRows[0] : null;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};


module.exports = {
  getDiary,
  getDiaryByUserId,
  createDiary,
  updateDiary,
  deleteDiary,
  getDiaryFromDate,
};
