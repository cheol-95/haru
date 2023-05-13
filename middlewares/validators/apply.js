const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');
const { parseGrapheme } = require('./common');

const createApply = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    message: Joi.string().required().max(100),
  });
  try {
    req.parse = parseGrapheme(req);
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.parse.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const getApplyByUser = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    user_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const getApplyById = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    apply_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const updateApply = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    apply_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    message: Joi.string().required().max(100),
  }).min(1);
  try {
    req.parse = parseGrapheme(req);
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.parse.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const deleteApply = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    apply_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const applyListByHost = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};
const applyListByUser = async (req, res, next) => {
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

const applyHandler = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    apply_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    allow: Joi.bool().required(),
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
  createApply,
  getApplyByUser,
  getApplyById,
  updateApply,
  deleteApply,
  applyListByHost,
  applyListByUser,
  applyHandler,
};
