const pool = require('../configs/mysql');
const { databaseError } = require('../utils/errors/database');

const createReport = async (createData) => {
  const conn = await pool.getConnection();
  try {
    const reportSql = `INSERT INTO report SET ?`;
    const [reportRows] = await conn.query(reportSql, createData);
    return reportRows;
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }
};

module.exports = {
  createReport,
};
