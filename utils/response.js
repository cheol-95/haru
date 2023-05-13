module.exports = (res, status = 200, value) => {
  const response = {
    result: true,
  };

  if (typeof value === 'object') {
    response.data = value;
  } else {
    response.message = value;
  }
  return res.status(status).json(response);
};
