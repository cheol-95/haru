class AuthError extends Error {
  constructor(err) {
    super();
    this.result = false;
    this.code = err.code;
    this.type = 'auth-error';
    this.message = err.message;
    this.status = err.status;
  }
}

const AuthErrorEnum = Object.freeze({
  'permission error': 'permission error',
  'jwt expired': 'jwt expired',
  'jwt not exist': 'jwt not exist',
  'jwt malformed': 'jwt malformed',
  'invalid signature': 'invalid signature',
  'jwt signature is required': 'jwt signature is required',
  'unequal email': 'unequal email',
});

authError = (err) => {
  switch (AuthErrorEnum[err.message]) {
    case 'permission error':
      err.status = 403;
      err.code = 101;
      err.message = `권한이 없습니다`;
      return new AuthError(err);

    case 'jwt expired':
      err.code = 101;
      err.message = `만료된 토큰입니다`;
      return new AuthError(err);

    case 'jwt not exist':
      err.code = 102;
      err.message = `토큰이 입력되지 않았습니다`;
      return new AuthError(err);

    case 'jwt malformed':
      err.code = 103;
      err.message = `토큰 형식이 잘못되었습니다`;
      return new AuthError(err);

    case 'invalid signature':
      err.code = 104;
      err.message = `서명이 올바르지 않습니다`;
      return new AuthError(err);

    case 'jwt signature is required':
      err.code = 105;
      err.message = `서명이 필요합니다`;
      return new AuthError(err);

    case 'unequal email':
      err.code = 106;
      err.message = `이메일을 잘못 입력했습니다`;

    default:
      err.code = 107;
      err.message = `인증 에러`;
      return new AuthError(err);
  }
};

module.exports = {
  AuthError,
  authError,
};
