const express = require('express');

const v1Router = require('./v1');
const commonRouter = require('./common');
// const adminRouter = require('./admin');

const router = express.Router();

/* routing */
router.use('/', v1Router);
// router.use('/', commonRouter);
// router.use('/admin', adminRouter);

module.exports = router;
