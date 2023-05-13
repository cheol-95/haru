const express = require('express');

const asyncWrap = require('../utils/errors/wrap');
const commonValid = require('../middlewares/validators/common');
const commonController = require('../controllers/common');

const router = express.Router();

router.get('/check-version', commonValid.checkVersion, asyncWrap(commonController.checkVersion));

const response = require('../utils/response');

router.get('/test', (req, res, next) => {
  response(res, 200, 'hello');
})
https://share-today.site/auth/kakao/callback
router.get('/auth/kakao/callback', (req, res, next) => {
  response(res, 200, req);
})

router.get('/db', async (req, res, next) => {
  const pool = require('../configs/mysql');
  const conn = await pool.getConnection();
  try {
    const createSql = `
      SHOW TABLES`;
    const [createRows] = await conn.query(createSql);
    response(res, 200, createRows);
  } catch (err) {
    throw databaseError(err);
  } finally {
    await conn.release();
  }

  // res.redirect(301, process.env.WEB);
});

router.get('/terms', (req, res, next) => {
  // res.redirect(301, process.env.TERMS);
});

router.get('/privacy', (req, res, next) => {
  // res.redirect(301, process.env.PRIVACY);
});

module.exports = router;
