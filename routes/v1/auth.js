const express = require('express');
const passport = require('passport');

// const { idCompare } = require('../../middlewares/auth');
const asyncWrap = require('../../utils/errors/wrap');
// const authValid = require('../../middlewares/validators/auth');
const authController = require('../../controllers/auth');

const router = express.Router();

// router.post('/signup', asyncWrap(authController.signup));

// router.post('/signup/kakao', asyncWrap(authController.signupForKakao));
// router.post('/signup/apple', asyncWrap(authController.signupForApple));
// router.post('/signup/google', asyncWrap(authController.signupForGoogle));

router.post('/login', asyncWrap(authController.login));
router.post('/logout', asyncWrap(authController.logout));

// router.get('/check-nickname/:nickname', userValid.checkNickname, asyncWrap(userController.checkNickname));
// router.get('/check-email/:email', userValid.checkEmail, asyncWrap(userController.checkEmail));
// router.get('/address', asyncWrap(userController.getAddress));
// router.get('/pushTest', asyncWrap(userController.pushTest));

module.exports = router;
