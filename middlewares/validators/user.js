const Joi = require('joi');

const { validError } = require('../../utils/errors/validation');
const { DeviceEnum } = require('../../utils/variables/enum');
const { parseGrapheme, setHttps } = require('./common');
const commonValid = require('./common');

const checkNickname = async (req, res, next) => {
  const paramSchema = Joi.object({
    nickname: Joi.string().required().min(2).max(8),
  });
  try {
    req.parse = parseGrapheme(req);
    await paramSchema.validateAsync(req.parse.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const checkEmail = async (req, res, next) => {
  const querySchema = Joi.object({
    email: Joi.string().email().required(),
  });
  try {
    await querySchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const signup = async (req, res, next) => {
  const bodySchema = Joi.object({
    email: Joi.string().email().required(),
    nickname: Joi.string().required().min(2).max(8),
    password: Joi.string().required().min(6).max(20),
  });
  try {
    req.parse = parseGrapheme(req);
    await bodySchema.validateAsync(req.parse.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const login = async (req, res, next) => {
  // const bodySchema = Joi.object({
  //   email: Joi.string().email().required(),
  //   password: Joi.string().required().min(6).max(20),
  //   push_token: Joi.string().required(),
  //   device: Joi.equal(...Object.values(DeviceEnum)).required(),
  // });
  try {
    // await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const logout = async (req, res, next) => {
  const bodySchema = Joi.object({
    id: Joi.number().required(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const getUser = async (req, res, next) => {
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

const userInfoUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    nickname: Joi.string().min(2).max(8),
    introduce: Joi.string().allow('').max(200),
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

const updateUserImage = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    image: Joi.string().allow(''),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const userCareerUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    career_title: Joi.string().allow('').min(2).max(20),
    career_contents: Joi.string().allow('').max(200),
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

const userSnsUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    sns_github: Joi.string().allow('').max(500),
    sns_linkedin: Joi.string().allow('').custom(commonValid.uriMethod).max(500),
    sns_web: Joi.string().allow('').max(500),
  }).min(1);
  try {
    req.body = setHttps(req.body);
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const userLocationUpdate = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });
  const bodySchema = Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number(),
    sido: Joi.string().max(20),
    sigungu: Joi.string().max(20),
  }).min(1);
  try {
    await paramSchema.validateAsync(req.params);
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const withdraw = async (req, res, next) => {
  const paramSchema = Joi.object({
    id: Joi.number().required(),
  });

  // const bodySchema = Joi.object({
  //   email: Joi.string().email().required(),
  //   password: Joi.string().required().max(20),
  // });

  try {
    await paramSchema.validateAsync(req.params);
    // await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const emailVerification = async (req, res, next) => {
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

const emailVerificationHandler = async (req, res, next) => {
  const paramSchema = Joi.object({
    email: Joi.string().email().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const reissuance = async (req, res, next) => {
  const bodySchema = Joi.object({
    refresh_token: Joi.string().required(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const resetPassword = async (req, res, next) => {
  const paramSchema = Joi.object({
    email: Joi.string().email().required(),
  });
  try {
    await paramSchema.validateAsync(req.params);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const updateEmail = async (req, res, next) => {
  const bodySchema = Joi.object({
    email: Joi.string().email().required(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

// TODO: 아래만 사용!!
const updateAlert = async (req, res, next) => {
  const bodySchema = Joi.object({
    alert: Joi.boolean(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const updatePushToken = async (req, res, next) => {
  const bodySchema = Joi.object({
    pushToken: Joi.string().required(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const updateAccessToken = async (req, res, next) => {
  const bodySchema = Joi.object({
    sns: Joi.string().required(),
    accessToken: Joi.string().required(),
  });
  try {
    await bodySchema.validateAsync(req.body);
    next();
  } catch (err) {
    next(validError(err));
  }
};

module.exports = {
  checkNickname,
  checkEmail,
  signup,
  login,
  logout,
  getUser,
  userInfoUpdate,
  updateUserImage,
  userCareerUpdate,
  userSnsUpdate,
  userLocationUpdate,
  withdraw,
  emailVerification,
  emailVerificationHandler,
  reissuance,
  resetPassword,
  updateEmail,
  updateAlert,
  updatePushToken,
  updateAccessToken
};
