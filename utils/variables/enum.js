const AuthEnum = Object.freeze({
  host: 'host',
  member: 'member',
  applier: 'applier',
  reject: 'reject',
  none: 'none',
});

const ApplyEnum = Object.freeze({
  apply: 'apply',
  allow: 'allow',
  reject: 'reject',
});

const CategoryEnum = Object.freeze({
  ai: 'ai',
  android: 'android',
  backend: 'backend',
  bigdata: 'bigdata',
  blockchain: 'blockchain',
  project: 'project',
  devops: 'devops',
  embedded: 'embedded',
  etc: 'etc',
  frontend: 'frontend',
  game: 'game',
  ios: 'ios',
  iot: 'iot',
  language: 'language',
  network: 'network',
  security: 'security',
});

const DeviceEnum = Object.freeze({
  ios: 'ios',
  android: 'android',
});

const PushEventEnum = Object.freeze({
  chat: 'chat',

  study_update: 'study_update',
  study_delegate: 'study_delegate',
  study_delete: 'study_delete',

  apply_new: 'apply_new',
  apply_allow: 'apply_allow',
  apply_reject: 'apply_reject',

  notice_new: 'notice_new',
  notice_update: 'notice_update',

  push_test: 'push_test',
});

const MessageEnum = Object.freeze({
  study_update: '스터디 내용이 수정되었습니다',
  study_delegate: '스터디 방장이 위임되었습니다',
  study_delete: '스터디가 삭제되었습니다',

  apply_new: '새로운 가입신청이 있습니다',
  apply_allow: '가입신청이 수락되었습니다',
  apply_reject: '가입신청이 거절되었습니다',

  notice_new: '새로운 공지사항이 있습니다',
  notice_update: '공지사항이 수정되었습니다',

  push_test: '푸시알림 테스트',
});

const DBTableEnum = Object.freeze({
  address: 'address',
  alert: 'alert',
  apply: 'apply',
  category_count: 'category_count',
  participate: 'participate',
  project: 'project',
  study: 'study',
  user: 'user',
});

const RedisEventEnum = Object.freeze({
  push_token: 'push_token',
  participate: 'participate',
  alert: 'alert',
  chat: 'chat',
  alert_read: 'alert_read',
  chat_read: 'chat_read',
  reset: 'reset',
  leave: 'leave',
});

const VersionUpdateEnum = Object.freeze({
  none: 0,
  should: 1,
  must: 2,
});

module.exports = {
  AuthEnum,
  ApplyEnum,
  CategoryEnum,
  DeviceEnum,
  PushEventEnum,
  MessageEnum,
  DBTableEnum,
  RedisEventEnum,
  VersionUpdateEnum,
};
