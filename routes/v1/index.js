const express = require('express');

const userRouter = require('./user');
const authRouter = require('./auth');
// const studyRouter = require('./study');

const router = express.Router();

/* routing */
router.use('/user', userRouter);
router.use('/auth', authRouter);
// router.use('/study', studyRouter);

module.exports = router;
