const { DatabaseError } = require('../../utils/errors/database');

const databaseErrorHandler = (err, req, res, next) => {
  if (err instanceof DatabaseError) {
    const status = err.status || 500;
    delete err.status;
    return res.status(status).json(err);
  }
  return next(err);
};

module.exports = {
  databaseErrorHandler,
};
