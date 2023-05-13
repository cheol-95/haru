const apn = require('apn');
const admin = require('firebase-admin');

const { apn: options } = require('../configs/config');
const { customError } = require('./errors/custom');

const apnProvider = new apn.Provider(options);

const apnSender = (apns_token, note) => {
  apnProvider.send(note, apns_token).then((result) => {
    if (result.failed.length > 0) {
      console.log('## APNs 에러: ', result.failed);
    }
  });
};

const fcmSender = (payload) => {
  try {
    admin.messaging().send(payload);
  } catch (err) {
    console.log('## FCM 에러: ', err);
    // throw customError(500, err);
  }
};

module.exports = {
  apnSender,
  fcmSender,
};
