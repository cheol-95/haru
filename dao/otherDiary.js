const pool = require('../configs/mysql');
const { databaseError } = require('../utils/errors/database');



const getOtherDiariesFromDate = async (user_id, start, end) => {
  const conn = await pool.getConnection();
  try {
    const selectSql = `
      SELECT id, is_like
      FROM user_other_diary
      WHERE user_id = ?
        AND created_at BETWEEN ? AND ?`;
    const [selectRows] = await conn.query(selectSql, [ user_id, start, end ]);
    return selectRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};


module.exports = {
  getOtherDiariesFromDate,
};
