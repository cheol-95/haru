const express = require('express');

const userRouter = require('./user');
const authRouter = require('./auth');
const diaryRouter = require('./diary');
const commentRouter = require('./comment');
const commonRouter = require('./common');

const router = express.Router();

/* routing */
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/diary', diaryRouter);
router.use('/comment', commentRouter);

router.use('/', commonRouter);

module.exports = router;
