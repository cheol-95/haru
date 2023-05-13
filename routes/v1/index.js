const express = require('express');

const userRouter = require('./user');
const authRouter = require('./auth');
const dairyRouter = require('./diary');

const router = express.Router();

/* routing */
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/diary', dairyRouter);

module.exports = router;
