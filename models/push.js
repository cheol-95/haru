// const apn = require('apn');
// const { MessageEnum, PushEventEnum } = require('../utils/variables/enum');

// class Note {
//   constructor(alert, payload) {
//     this.topic = process.env.APNS_bundleId;
//     this.sound = 'default';
//     this.expiry = Math.floor(Date.now() / 1000) + 100;
//     this.alert = alert;
//     this.payload = payload;
//   }
// }

// class Payload {
//   constructor(alert, data) {
//     this.notification = {
//       title: '터미널',
//       body: alert,
//     };
//     this.data = {
//       title: '터미널',
//       body: alert,
//       ...data,
//     };
//   }
// }

// const getPushPayload = (pushEvent, study_id) => {
//   const alert = MessageEnum[pushEvent];
//   const data = {
//     pushEvent,
//     study_id: study_id + '',
//     alert_id: '',
//     badge: '',
//   };
//   const note = new Note(alert, data);

//   return {
//     apnsPayload: new apn.Notification(note),
//     fcmPayload: new Payload(alert, data),
//   };
// };

// module.exports = {
//   getPushPayload,
// };
