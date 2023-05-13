const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');
const { parseGrapheme, setHttps } = require('./common');
const commonValid = require('./common');

const createStudy = async (req, res, next) => {
  const bodySchema = Joi.object({
    category: Joi.string().custom(commonValid.categoryValid).required(),
    title: Joi.string().required().min(2).max(20),
    introduce: Joi.string().required().max(200),
    sns_notion: Joi.string().allow('').custom(commonValid.uriMethod).max(500),
    sns_evernote: Joi.string().allow('').custom(commonValid.uriMethod).max(500),
    sns_web: Joi.string().allow('').max(500),
    progress: Joi.string().required().max(100),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    sido: Joi.string().max(20).required(),
    sigungu: Joi.string().max(20).required(),
    address_name: Joi.string().max(100).required(),
    place_name: Joi.string().allow('').max(30),
    location_detail: Joi.string().allow('').max(30),
    study_time: Joi.string().required().max(100),
    image: Joi.allow(),
  });

  try {
    req.body = setHttps(req.body);
    req.parse = parseGrapheme(req);
    req = await bodySchema.validateAsync(req.parse.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const getStudy = async (req, res, next) => {
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

const updateStudy = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    category: Joi.string(),
    title: Joi.string().min(2).max(20),
    introduce: Joi.string().max(200),
    sns_notion: Joi.string().allow('').custom(commonValid.uriMethod).max(500),
    sns_evernote: Joi.string().allow('').custom(commonValid.uriMethod).max(500),
    sns_web: Joi.string().allow('').max(500),
    progress: Joi.string().max(100),
    latitude: Joi.number(),
    longitude: Joi.number(),
    sido: Joi.string().max(20),
    sigungu: Joi.string().max(20),
    address_name: Joi.string().max(100),
    place_name: Joi.string().allow('').max(30),
    location_detail: Joi.string().allow('').max(30),
    study_time: Joi.string().max(100),
    image: Joi.allow(),
  }).min(1);
  try {
    req.body = setHttps(req.body);
    req.parse = parseGrapheme(req);
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.parse.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const deleteStudy = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().min(1).required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const getMyStudy = async (req, res, next) => {
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

const getStudyList = async (req, res, next) => {
  const querySchema = Joi.object({
    category: Joi.string().custom(commonValid.categoryValid).required(),
    sort: Joi.string().required(),
  });
  try {
    await querySchema.validateAsync(req.query);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const studyPaging = async (req, res, next) => {
  const querySchema = Joi.object({
    values: Joi.string().min(1).required(),
    option: Joi.string(),
  });
  try {
    await querySchema.validateAsync(req.query);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const leaveStudy = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.string().min(1).required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const delegate = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().min(1).required(),
  });
  const bodySchema = Joi.object({
    new_leader: Joi.number().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const search = async (req, res, next) => {
  const querySchema = Joi.object({
    word: Joi.string().max(30).required(),
  });
  try {
    req.parse = parseGrapheme(req);
    await querySchema.validateAsync(req.parse.query);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const getChatting = async (req, res, next) => {
  const paramSchema = Joi.object({
    study_id: Joi.number().required(),
  });
  const querySchema = Joi.object({
    date: Joi.string().required(),
    first: Joi.bool(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    await querySchema.validateAsync(req.query);
    next();
  } catch (err) {
    next(validError(err));
  }
};

module.exports = {
  createStudy,
  getStudy,
  updateStudy,
  deleteStudy,
  getMyStudy,
  getStudyList,
  studyPaging,
  leaveStudy,
  delegate,
  search,
  getChatting,
};
