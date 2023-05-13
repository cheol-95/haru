const { AuthError } = require('../../utils/errors/auth');

const authErrorHandler = (err, req, res, next) => {
  if (err instanceof AuthError) {
    if (err.status) {
      const status = err.status;
      delete err.status;
      return res.status(status).json(err);
    }
    return res.status(401).json(err);
  }
  return next(err);
};

module.exports = {
  authErrorHandler,
};
