const pool = require('../configs/mysql');
const { databaseError } = require('../utils/errors/database');

const getCalender = async (user_id) => {
  const conn = await pool.getConnection();
  
  try {
    const diarySql = `
      SELECT *
      FROM diary
      WHERE user_id = ?
        AND removed_at IS NULL;
    `;
    const [diaryRows] = await conn.query(diarySql, [user_id]);
    return diaryRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

// const checkVersion = async (version, device) => {
//   const conn = await pool.getConnection();
//   try {
//     const checkSql = `
//       SELECT V.id, V.device, V.version, V.force
//       FROM version V
//       WHERE id > (
//         SELECT id 
//         FROM version 
//         WHERE version = ?
//           AND device = ? )
//         AND device = ?`;
//     const [checkRows] = await conn.query(checkSql, [version, device, device]);
//     return checkRows;
//   } catch (err) {
//     throw databaseError(err);
//   } finally {
//     await conn.release();
//   }
// };

module.exports = {
  getCalender,
  // checkVersion,
};
