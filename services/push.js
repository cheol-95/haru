// const pushDao = require('../dao/push');
// const studyDao = require('../dao/study');
// const { getChatPayload, getPushPayload } = require('../models/push');
// const { RedisEventEnum, PushEventEnum, DeviceEnum, MessageEnum } = require('../utils/variables/enum');
// const { redisTrigger } = require('./redis');
// const { apnSender, fcmSender } = require('../utils/push');

// const getTokenRows = async (pushEvent, study_id, user_id) => {
//   const target = {
//     toHost: [PushEventEnum.apply_new],
//     toUser: [PushEventEnum.push_test, PushEventEnum.study_delete, PushEventEnum.apply_reject, PushEventEnum.apply_allow],
//     toStudyWithoutHost: [PushEventEnum.study_update, PushEventEnum.notice_new, PushEventEnum.notice_update],
//     toStudyWithoutUser: [PushEventEnum.study_delegate],
//   };

//   if (target.toHost.includes(pushEvent)) {
//     return await pushDao.getHostToken(study_id);
//   }

//   if (target.toUser.includes(pushEvent)) {
//     return await pushDao.getUserToken(user_id);
//   }

//   if (target.toStudyWithoutHost.includes(pushEvent)) {
//     return await pushDao.getMemberWithoutHostToken(study_id);
//   }

//   if (target.toStudyWithoutUser.includes(pushEvent)) {
//     return await pushDao.getMemberWithoutUserToken(study_id, user_id);
//   }
// };

// const chat = async (study_id, chat) => {
//   const { apnsPayload, fcmPayload } = getChatPayload(chat);
//   let redisData = '';
//   const tokenRows = await pushDao.getOffMemberToken(study_id, chat.nickname);

//   for (let row of tokenRows) {
//     redisData = await redisTrigger(row.id, RedisEventEnum.chat, { study_id });
//     apnsPayload.badge = redisData.badge;

//     if (row.device === DeviceEnum.ios) {
//       apnsPayload.badge = redisData.badge;
//       apnSender(row.push_token, apnsPayload);
//     } else {
//       fcmPayload.data.badge = redisData.badge + '';
//       fcmPayload.tokens = [row.push_token];
//       fcmSender(fcmPayload);
//     }
//   }
// };

// const push = async (pushEvent, study_id, user_id) => {
//   const studyRows = Boolean(pushEvent === PushEventEnum.study_delete)
//     ? await pushDao.getStudyTitle(study_id)
//     : await studyDao.getStudy(study_id);

//   const insertData = {
//     pushEvent,
//     study_id,
//     study_title: studyRows[0].title,
//     message: MessageEnum[pushEvent],
//   };

//   const tokenRows = await getTokenRows(pushEvent, study_id, user_id);

//   for (let row of tokenRows) {
//     alertRows = await pushDao.insertAlert({ ...insertData, user_id: row.id });
//     row.alert_id = alertRows.insertId;
//     redisData = await redisTrigger(row.id, RedisEventEnum.alert, { study_id });
//     row.badge = redisData.badge;
//   }

//   const { apnsPayload, fcmPayload } = getPushPayload(pushEvent, study_id);
//   return send(tokenRows, apnsPayload, fcmPayload);
// };

// const send = async (tokenRows, apnsPayload, fcmPayload) => {
//   for (let row of tokenRows) {
//     delete apnsPayload.compiled;
//     if (row.device === DeviceEnum.ios) {
//       apnsPayload.badge = row.badge;
//       apnsPayload.payload.alert_id = row.alert_id;
//       apnSender(row.push_token, apnsPayload);
//     } else {
//       fcmPayload.data.alert_id = row.alert_id + '';
//       fcmPayload.data.badge = row.badge + '';
//       fcmPayload.token = row.push_token;
//       fcmSender(fcmPayload);
//     }
//   }
// };

// module.exports = {
//   chat,
//   push,
// };
