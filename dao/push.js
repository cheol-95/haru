const pool = require('../configs/mysql');
const { databaseError } = require('../utils/errors/database');

const getMemberWithoutHostToken = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const getMemberSql = `
      SELECT u.id, u.device, u.push_token
      FROM participate p
        LEFT JOIN user u
        ON p.user_id = u.id
      WHERE p.study_id = ?
        AND p.leader = ?
      ORDER BY u.device`;
    const [memberRows] = await conn.query(getMemberSql, [study_id, false]);
    return memberRows;
  } catch (err) {
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};

const getOffMemberToken = async (study_id, nickname) => {
  const conn = await pool.getConnection();
  try {
    const getMemberSql = `
      SELECT u.id, u.device, u.push_token
      FROM participate p
        LEFT JOIN user u
        ON p.user_id = u.id
      WHERE p.study_id = ?
        AND BINARY nickname != ?
        AND p.chat_status = ?
      ORDER BY u.device`;
    const [offMemberRows] = await conn.query(getMemberSql, [study_id, nickname, false]);
    return offMemberRows;
  } catch (err) {
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};

const getUserToken = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const getTokenSql = `
      SELECT id, device, push_token
      FROM user
      WHERE id = ?`;
    const [tokenRows] = await conn.query(getTokenSql, [user_id]);
    return tokenRows;
  } catch (err) {
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};

const getHostToken = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const getTokenSql = `
      SELECT u.id, u.device, u.push_token
      FROM user u
        LEFT JOIN participate p
        ON u.id = p.user_id
      WHERE p.study_id = ?
        AND p.leader = ?`;
    const [tokenRows] = await conn.query(getTokenSql, [study_id, true]);
    return tokenRows;
  } catch (err) {
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};

const insertAlert = async (insertData) => {
  const conn = await pool.getConnection();
  try {
    const insertSql = `
      INSERT INTO alert
      SET ?`;
    const [insertRows] = await conn.query(insertSql, insertData);
    return insertRows;
  } catch (err) {
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};

const getMemberWithoutUserToken = async (study_id, user_id) => {
  const conn = await pool.getConnection();
  try {
    const getMemberSql = `
      SELECT u.id, u.device, u.push_token
      FROM participate p
        LEFT JOIN user u
        ON p.user_id = u.id
      WHERE p.study_id = ?
        AND u.id != ?
      ORDER BY u.device`;
    const [memberRows] = await conn.query(getMemberSql, [study_id, user_id]);
    return memberRows;
  } catch (err) {
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};

const getStudyTitle = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const getTitleSql = `
      SELECT study_title title 
      FROM alert 
      WHERE study_id = ?`;
    const [titleRows] = await conn.query(getTitleSql, [study_id]);
    return titleRows;
  } catch (err) {
    throw databaseError(500, err);
  } finally {
    await conn.release();
  }
};

module.exports = {
  getMemberWithoutHostToken,
  getMemberWithoutUserToken,
  getOffMemberToken,
  getUserToken,
  getHostToken,
  insertAlert,
  getStudyTitle,
};
