const pool = require('../configs/mysql');
const { customError } = require('../utils/errors/custom');

const updateChatStatus = async (status, study_id, user_id) => {
  const conn = await pool.getConnection();
  try {
    const connectionSql = `
      UPDATE participate
      SET chat_status = ?
      WHERE study_id = ?
        AND user_id = ?`;
    const [connectionRows] = await conn.query(connectionSql, [status, study_id, user_id]);
    return connectionRows;
  } catch (err) {
    throw customError(500, err.sqlMessage);
  } finally {
    await conn.release();
  }
};

module.exports = {
  updateChatStatus,
};
