class ValidError extends Error {
  constructor(err) {
    super();
    this.result = false;
    this.code = err.code;
    this.type = 'validation-error';
    this.label = err.label;
    this.message = err.message;
  }
}
const validErrorHandler = Object.freeze({
  'object.min': 'object.min',
  'any.required': 'any.required',
  'object.unknown': 'object.unknown',
  'string.empty': 'string.empty',
  'string.email': 'string.email',
  'string.max': 'string.max',
  'string.min': 'string.min',
  'number.base': 'number.base',
  'boolean.base': 'boolean.base',
  'uri.invalidUri': 'uri.invalidUri',
  'category.invalidCategory': 'category.invalidCategory',
  'array.min': 'array.min',
  'array.max': 'array.max',
  'string.base': 'string.base',
  'any.only': 'any.only',
});

validError = (err) => {
  switch (validErrorHandler[err.details[0].type]) {
    case 'object.min':
      err.code = 101;
      err.label = 'too few value';
      err.message = `최소 ${err.details[0].context.limit}개 이상의 값을 입력하세요`;
      return new ValidError(err);

    case 'any.required':
      err.code = 102;
      err.label = err.details[0].path[0];
      err.message = `값을 입력하세요`;
      return new ValidError(err);

    case 'object.unknown':
      err.code = 103;
      err.label = err.details[0].path[0];
      err.message = `허용되지 않은 값입니다`;
      return new ValidError(err);

    case 'string.empty':
      err.code = 104;
      err.label = err.details[0].context.label;
      err.message = `공백은 허용되지 않습니다`;
      return new ValidError(err);

    case 'string.email':
      err.code = 105;
      err.label = err.details[0].context.label;
      err.message = `유효하지 않은 이메일입니다`;
      return new ValidError(err);

    case 'string.max':
      err.code = 106;
      err.label = err.details[0].context.label;
      err.message = `길이는 ${err.details[0].context.limit} 보다 짧아야 합니다`;
      return new ValidError(err);

    case 'string.min':
      err.code = 107;
      err.label = err.details[0].context.label;
      err.message = `길이는 ${err.details[0].context.limit} 보다 길어야 합니다`;
      return new ValidError(err);

    case 'number.base':
      err.code = 108;
      err.label = err.details[0].context.label;
      err.message = `숫자만 입력 가능합니다`;
      return new ValidError(err);

    case 'boolean.base':
      err.code = 109;
      err.label = err.details[0].context.label;
      err.message = `true/false만 입력 가능합니다`;
      return new ValidError(err);

    case 'uri.invalidUri':
      err.code = 110;
      err.label = err.details[0].context.label;
      err.message = `유효하지 않은 주소입니다`;
      return new ValidError(err);

    case 'category.invalidCategory':
      err.code = 111;
      err.label = err.details[0].context.label;
      err.message = `유효하지 않은 카테고리입니다`;
      return new ValidError(err);

    case 'array.min':
      err.code = 112;
      err.label = err.details[0].context.label;
      err.message = `최소 1개 이상의 값을 입력해야 합니다`;
      return new ValidError(err);

    case 'array.max':
      err.code = 113;
      err.label = err.details[0].context.label;
      err.message = `최대 3개까지 입력할 수 있습니다`;
      return new ValidError(err);

    case 'string.base':
      err.code = 114;
      err.label = err.details[0].context.label;
      err.message = `문자열만 입력 가능합니다`;
      return new ValidError(err);

    case 'any.only':
      err.code = 115;
      err.label = err.details[0].context.label;
      err.message = `ios, android만 입력 가능합니다`;
      return new ValidError(err);

    default:
      err.code = 116;
      err.label = err.details[0].context.label;
      err.message = `유효성검사 에러`;
      return new ValidError(err);
  }
};

module.exports = {
  ValidError,
  validError,
};
