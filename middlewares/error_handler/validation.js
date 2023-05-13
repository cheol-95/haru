const { ValidError } = require('../../utils/errors/validation');

const validErrorHandler = (err, req, res, next) => {
  if (err instanceof ValidError) {
    return res.status(422).json(err);
  }
  return next(err);
};

module.exports = {
  validErrorHandler,
};
