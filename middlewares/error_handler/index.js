// const { sentryHandler } = require('./sentry');
const { commonErrorHandler } = require('./common');
const { authErrorHandler } = require('./auth');
const { validErrorHandler } = require('./validation');
const { firebaseErrorHandler } = require('./firebase');
const { databaseErrorHandler } = require('./database');
const { customErrorHandler } = require('./custom');

module.exports = (app) => {
  // sentryHandler(app, false);
  app.use(commonErrorHandler);
  app.use(authErrorHandler);
  app.use(validErrorHandler);
  app.use(firebaseErrorHandler);
  app.use(databaseErrorHandler);
  app.use(customErrorHandler);
  // sentryHandler(app, true);

  app.use((err, req, res, next) => {
    return res.status(500).json({
      result: false,
      message: err.message,
    });
  });
};
