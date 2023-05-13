const Joi = require('joi');

const { DeviceEnum } = require('../../utils/variables/enum');
const { validError } = require('../../utils/errors/validation');

const getRedis = async (req, res, next) => {
  const paramSchema = Joi.object({
    user_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const setVersion = async (req, res, next) => {
  const bodySchema = Joi.object({
    version: Joi.string().required(),
    device: Joi.equal(...Object.values(DeviceEnum)).required(),
    force: Joi.bool().required(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

module.exports = {
  getRedis,
  setVersion,
};
