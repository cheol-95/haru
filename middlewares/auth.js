const jwt = require('jsonwebtoken');

const { authError } = require('../utils/errors/auth');
const { CategoryEnum } = require('../utils/variables/enum');

const passUrl = {
  pathName: ['/', '/check-version', '/favicon.ico'],
  second: ['check-nickname', 'check-email', 'login', 'emailVerify-process', 'reset-password', 'reissuance', ...Object.keys(CategoryEnum)],
  full: ['/v1/user', '/v1/push/test', '/v1/chat/http', '/v1/chat/https'],
  first: ['web', 'terms', 'privacy'],
};

const checkPassUrl = (req) => {
  const parseUrl = req.url.split('/');
  if (passUrl.pathName.includes(req._parsedUrl.pathname)) {
    return true;
  }
  if (passUrl.second.indexOf(parseUrl[2]) > -1) {
    return true;
  }
  if (passUrl.full.indexOf(req.url) > -1) {
    return true;
  }
  if (passUrl.first.indexOf(parseUrl[1]) > -1) {
    return true;
  }
  return false;
};

const verify = async (req, res, next) => {
  if (checkPassUrl(req)) {
    return next();
  }

  if (req.headers.authorization) {
    req.jwt = req.headers.authorization.split(' ')[1];
    try {
      req.user = await jwt.verify(req.jwt, process.env.JWT_secret);
      return next();
    } catch (err) {
      return next(authError(err));
    }
  }
  return next(authError({ message: 'jwt not exist' }));
};

const idCompare = (req, res, next) => {
  const id = req.params.id || req.params.user_id || req.body.id;
  if (req.user.id !== Number(id)) {
    next(authError({ message: 'permission error' }));
  }
  next();
};

const emailCompare = (req, res, next) => {
  const email = req.query.email || req.params.email;
  if (req.user.email !== email) {
    next(authError({ message: 'unequal email' }));
  }
  next();
};

const checkAdmin = (req, res, next) => {
  if (req.user.id !== 156) {
    throw authError({ message: 'permission error' });
  }
  next();
};

module.exports = {
  verify,
  idCompare,
  emailCompare,
  checkAdmin,
};
