const pool = require('../configs/mysql');
const { databaseError } = require('../utils/errors/database');

const getUserList = async () => {
  const conn = await pool.getConnection();
  try {
    const userListSql = `
      SELECT id
      FROM user`;
    const [userListRows] = await conn.query(userListSql);
    return userListRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getUserStudyList = async (user_id) => {
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      SELECT study_id id
      FROM participate
      WHERE user_id = ?`;
    const [studyListRows] = await conn.query(studyListSql, [user_id]);
    return studyListRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const deleteEmptyStudy = async () => {
  const conn = await pool.getConnection();
  try {
    const studyListSql = `
      DELETE FROM study
      WHERE id in (
        SELECT T.id
        FROM (
          SELECT S.id, count(P.id) as member_count
          FROM study S
            left join participate P
            on S.id = P.study_id
          GROUP BY S.id) T
        WHERE T.member_count = 0 )`;
    const [studyListRows] = await conn.query(studyListSql);
    return studyListRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const setVersion = async (versionData) => {
  const conn = await pool.getConnection();
  try {
    const versionSql = `
      INSERT INTO version
      SET ?`;
    const [versionRows] = await conn.query(versionSql, [versionData]);
    return versionRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getParticipate = async () => {
  const conn = await pool.getConnection();
  try {
    const participateSql = `
      SELECT user_id, study_id
      FROM participate`;
    const [participateRows] = await conn.query(participateSql);
    return participateRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const setParticipateLog = async (participateRows) => {
  const conn = await pool.getConnection();
  try {
    const setParticipateSql = `
      INSERT INTO participate_log
      SET ?`;
    const [insertRows] = await conn.query(setParticipateSql, participateRows);
    return insertRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};
module.exports = {
  getUserList,
  getUserStudyList,
  deleteEmptyStudy,
  setVersion,
  getParticipate,
  setParticipateLog,
};
