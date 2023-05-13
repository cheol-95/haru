const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');
const { parseGrapheme, setHttps } = require('./common');
const commonValid = require('./common');

const createDiary = async (req, res, next) => {
  const bodySchema = Joi.object({
    content: Joi.string().min(2).max(500),
  }).min(1);
  try {
    req.parse = parseGrapheme(req);
    await bodySchema.validateAsync(req.parse.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const getDiary = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  try {
    req.parse = parseGrapheme(req);
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

// const userSnsUpdate = async (req, res, next) => {
//   const paramSchema = Joi.object({
//     id: Joi.number().required(),
//   });
//   const bodySchema = Joi.object({
//     sns_github: Joi.string().allow('').max(500),
//     sns_linkedin: Joi.string().allow('').custom(commonValid.uriMethod).max(500),
//     sns_web: Joi.string().allow('').max(500),
//   }).min(1);
//   try {
//     req.body = setHttps(req.body);
//     await paramSchema.validateAsync(req.params);
//     await bodySchema.validateAsync(req.body);
//     next();
//   } catch (err) {
//     next(validError(err));
//   }
// };

module.exports = {
  createDiary,
  getDiary,
};
