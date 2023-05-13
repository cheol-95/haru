const fs = require('fs');
const { logger, getErrorObject } = require('../../configs/winston');

const commonErrorHandler = (err, req, res, next) => {
  const errorObject = getErrorObject(req, err);
  logger.error(JSON.stringify(errorObject, null, 2));

  if (req.file) {
    fs.unlink(req.file.path, (err) => {});
  }
  next(err);
};

module.exports = {
  commonErrorHandler,
};
