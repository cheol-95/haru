const { FirebaseError } = require('../../utils/errors/firebase');

const firebaseErrorHandler = (err, req, res, next) => {
  if (err instanceof FirebaseError) {
    const status = err.status;
    delete err.status;
    return res.status(status).json(err);
  }
  return next(err);
};

module.exports = {
  firebaseErrorHandler,
};
