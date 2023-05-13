const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');

const getAlert = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const confirmAlert = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
    alert_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

module.exports = {
  getAlert,
  confirmAlert,
};
