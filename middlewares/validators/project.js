const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');
const { uriMethod, parseProjectGrapheme } = require('./common');

const getProjectList = async (req, res, next) => {
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

const updateProject = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });

  const projectSchema = Joi.object({
    id: Joi.allow(),
    title: Joi.string().max(20).required(),
    contents: Joi.string().max(500).required(),
    sns_github: Joi.string().allow('').max(500),
    sns_appstore: Joi.string().allow('').custom(uriMethod).max(500),
    sns_playstore: Joi.string().allow('').custom(uriMethod).max(500),
  });

  const bodySchema = Joi.object({
    project_list: Joi.array().items(projectSchema).required(),
  });

  try {
    req.parse = parseProjectGrapheme(req);
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.parse.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

module.exports = {
  getProjectList,
  updateProject,
};
