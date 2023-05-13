const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_secret;
const options = {
  issuer: process.env.JWT_issuer,
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_secret);
  } catch (err) {
    return {
      err: true,
    };
  }
};

const getJwt = ({ id }) => {
  const payload = { id };
  // options.expiresIn = Number(process.env.JWT_accessExpire);
  // options.subject = 'userInfo-access';
  return jwt.sign(payload, secretKey, options);
};

// const getRefreshToken = ({ id }) => {
//   const payload = { id };
//   options.expiresIn = process.env.JWT_refreshExpire;
//   options.subject = 'userInfo-refresh';
//   return jwt.sign(payload, secretKey, options);
// };

// const socketVerify = (socket, next) => {
//   if (socket.handshake.query.token) {
//     jwt.verify(socket.handshake.query.token, process.env.JWT_secret, (err, decoded) => {
//       if (err) {
//         console.log('## 소켓 토큰에러: ', err);
//         return next(err);
//       }
//       socket.decoded = decoded;
//       return next();
//     });
//   } else {
//     return next('not exist token');
//   }
// };

const getPayload = (jwt_token) => {
  const payload = Buffer.from(jwt_token.split('.')[1], 'base64').toString();
  return JSON.parse(payload);
};

module.exports = {
  verifyRefreshToken,
  getJwt,
  // getRefreshToken,
  // socketVerify,
  getPayload,
};
