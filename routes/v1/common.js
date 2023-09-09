const express = require('express');

// const { idCompare } = require('../../middlewares/auth');
const asyncWrap = require('../../utils/errors/wrap');
// const commonValid = require('../../middlewares/validators/common');
const commonController = require('../../controllers/common');

const router = express.Router();

router.get('/calender', asyncWrap(commonController.getCalender));

module.exports = router;
