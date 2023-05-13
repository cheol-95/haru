const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');

const createReport = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    message: Joi.string().required().max(500),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

module.exports = {
  createReport,
};
