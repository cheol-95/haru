const Joi = require('joi');
const GraphemeSplitter = require('grapheme-splitter');

const { validError } = require('../../utils/errors/validation');
const { CategoryEnum, DeviceEnum } = require('../../utils/variables/enum');

const splitter = new GraphemeSplitter();

const categoryValid = (value, helpers) => {
  if (!CategoryEnum[value]) {
    return helpers.error('category.invalidCategory');
  }
  return value;
};

const urlList = {
  sns_web: 'https://',
  sns_appstore: 'https://apps.apple.com/',
  sns_playstore: 'https://play.google.com/',
  sns_notion: 'https://notion.so/',
  sns_evernote: 'https://evernote.com/',
  sns_linkedin: 'https://linkedin.com/',
  static_urls: ['sns_appstore', 'sns_playstore'],
};

const uriMethod = (value, helpers) => {
  const sns = helpers.state.path.slice(-1)[0];
  const url = urlList[sns];
  let target = value;

  if (!urlList.static_urls.includes(sns) && target.indexOf('www.') === 8) {
    target = value.replace('www.', '');
  }

  if (url !== target.slice(0, url.length)) {
    return helpers.error('uri.invalidUri');
  }
  return target;
};

const checkVersion = async (req, res, next) => {
  const querySchema = Joi.object({
    version: Joi.string().required(),
    device: Joi.equal(...Object.values(DeviceEnum)).required(),
  });
  try {
    await querySchema.validateAsync(req.query);
    next();
  } catch (err) {
    next(validError(err));
  }
};

const parseRequest = (req, res, next) => {
  for (let prop in req.body) {
    req.body[prop] = typeof req.body[prop] === 'string' ? req.body[prop].trim() : req.body[prop];
  }

  for (let prop in req.query) {
    req.query[prop] = typeof req.query[prop] === 'string' ? req.query[prop].trim() : req.query[prop];
  }
  return next();
};

const parseGrapheme = (req) => {
  const targets = ['body', 'params', 'query'];
  const grapheme = {
    body: {},
    params: {},
    query: {},
  };

  targets.forEach((target) => {
    Object.entries(req[target]).forEach(([key, value]) => {
      grapheme[target][key] = '';
      if (typeof value === 'string') {
        splitter.splitGraphemes(value).forEach((char) => {
          char.length > 1 ? (grapheme[target][key] += 'A') : (grapheme[target][key] += char);
        });
      } else {
        grapheme[target][key] = value;
      }
    });
  });
  return grapheme;
};

const parseProjectGrapheme = (req) => {
  const parse = {
    body: {},
  };

  if (!req.body.project_list) {
    return parse;
  }
  let tmp = {};

  parse.body.project_list = req.body.project_list.map((project) => {
    project = setHttps(project);
    tmp = {};
    Object.entries(project).forEach(([key, value]) => {
      if (typeof value === 'string') {
        tmp[key] = '';
        splitter.splitGraphemes(value).forEach((char) => {
          char.length > 1 ? (tmp[key] += 'A') : (tmp[key] += char);
        });
      } else {
        tmp[key] = value;
      }
    });
    return tmp;
  });
  return parse;
};

const setHttps = (body) => {
  for (let prop in body) {
    if (prop.slice(0, 4) === 'sns_' && prop !== 'sns_github') {
      if (body[prop] !== '' && !body[prop].includes('https://')) {
        body[prop] = 'https://' + body[prop];
      }
    }
  }
  return body;
};

module.exports = {
  categoryValid,
  uriMethod,
  parseRequest,
  checkVersion,
  parseGrapheme,
  parseProjectGrapheme,
  setHttps,
};
