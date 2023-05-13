class CustomError extends Error {
  constructor(status, message, code) {
    super();
    this.result = false;
    this.code = code;
    this.message = message;
    this.status = status;
  }
}

const customError = (status, message, code) => {
  return new CustomError(status, message, code);
};

module.exports = {
  CustomError,
  customError,
};
