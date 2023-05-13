const pool = require('../configs/mysql');
const { databaseError } = require('../utils/errors/database');

const createNotice = async (createData) => {
  const conn = await pool.getConnection();
  try {
    const createSQL = 'INSERT INTO notice SET ?';
    const [createRows] = await conn.query(createSQL, [createData]);
    return createRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getNotice = async (study_id, notice_id) => {
  const conn = await pool.getConnection();
  try {
    const noticeSQL = `
      SELECT
        n.id, n.study_id, n.title, n.contents, n.pinned, n.user_id leader_id, u.image leader_image, u.nickname leader_nickname,
        UNIX_TIMESTAMP(n.updated_at) as updated_at
      FROM notice n
        LEFT JOIN user u
        ON n.user_id = u.id
      WHERE n.id = ?
        AND n.study_id = ?`;
    const [detailRows] = await conn.query(noticeSQL, [notice_id, study_id, true]);
    return detailRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const updateNotice = async (study_id, notice_id, updateData) => {
  const conn = await pool.getConnection();
  try {
    const updateSQL = `
      UPDATE notice
      SET ?
      WHERE id = ?
        AND study_id = ?`;
    const [updateRows] = await conn.query(updateSQL, [updateData, notice_id, study_id]);
    return updateRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const deleteNotice = async (study_id, notice_id) => {
  const conn = await pool.getConnection();
  try {
    const deleteSQL = `
      DELETE FROM notice
      WHERE id = ? 
      AND study_id = ?`;
    const [deleteRows] = await conn.query(deleteSQL, [notice_id, study_id]);
    return deleteRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const getNoticeList = async (study_id) => {
  const conn = await pool.getConnection();
  try {
    const deleteSQL = `
      SELECT id, title, contents, pinned,
        UNIX_TIMESTAMP(created_at) as created_at,
        UNIX_TIMESTAMP(updated_at) as updated_at
      FROM notice
      WHERE study_id = ?
      ORDER BY  pinned DESC, id DESC`;
    const [listRows] = await conn.query(deleteSQL, [study_id]);
    return listRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

const noticePaging = async (noticeKeys) => {
  const keys = noticeKeys.concat(noticeKeys);
  const conn = await pool.getConnection();
  try {
    const listSql = `
    SELECT id, title, contents, pinned,
      UNIX_TIMESTAMP(created_at) as created_at,
      UNIX_TIMESTAMP(updated_at) as updated_at
    FROM notice
    WHERE id in (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ORDER BY FIELD(id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [listRows] = await conn.query(listSql, keys);
    return listRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

module.exports = {
  createNotice,
  getNotice,
  updateNotice,
  deleteNotice,
  getNoticeList,
  noticePaging,
};
