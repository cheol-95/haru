const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');
const { parseGrapheme } = require('./common');

const createNotice = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    pinned: Joi.boolean().strict().required(),
    title: Joi.string().required().max(30),
    contents: Joi.string().required().max(200),
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

const getNotice = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    notice_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const updateNotice = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    notice_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    title: Joi.string().max(30),
    contents: Joi.string().max(200),
    pinned: Joi.boolean().strict(),
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

const deleteNotice = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
    notice_id: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const getNoticeList = async (req, res, next) => {
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

const noticePaging = async (req, res, next) => {
  const querySchema = Joi.object({
    values: Joi.string().min(1).required(),
  });
  try {
    await querySchema.validateAsync(req.query);
    next();
  } catch (err) {
    next(validError(err));
  }
};

module.exports = {
  createNotice,
  getNotice,
  updateNotice,
  deleteNotice,
  getNoticeList,
  noticePaging,
};
