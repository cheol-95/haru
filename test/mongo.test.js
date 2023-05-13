require('dotenv').config();

const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

const connect = () => {
  const host = process.env.MONGO_host;
  const option = process.env.MONGO_option;

  mongoose.connect(
    host.concat(option),
    {
      dbName: 'chat',
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log('몽고디비 최초 연결 에러', err);
      }
    }
  );
};
connect();

mongoose.connection.on('err', (err) => {
  console.error('몽고디비 연결 에러', err);
});
mongoose.connection.on('disconnected', () => {
  console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
  connect();
});

// 지정 시간이후 채팅내용 조회 테스트
const Chat = require('../models/chat');

// Chat.find({ _id: { $gt: objectIdWithTimestamp('2020/10/28 18:44:20') } }, (err, docs) => {
// Chat.find({ _id: { $gt: objectIdWithTimestamp(1603878260) } }, (err, docs) => {
//   console.log('docs: ', docs);
// });

// 시간을 ObjectId에 맞는 형태로 변경
function objectIdWithTimestamp(timestamp) {
  let hexSeconds = 0;
  if (typeof timestamp == 'string') {
    timestamp = new Date(timestamp);
    hexSeconds = Math.floor(timestamp / 1000).toString(16);
  } else if (timestamp) {
    hexSeconds = timestamp.toString(16);
  } else {
    hexSeconds = Math.floor(new Date().getTime() / 1000).toString(16);
  }
  return hexSeconds + '0000000000000000';
}

// 현재 유닉스 시간 구하기
// const timestampToUnixTime = Math.floor(new Date().getTime() / 1000);

const Room = require('../models/room');

// 스터디아이디 1,2 중복처리 테스트
// Chat.updateMany({ room_number: { $in: ['1','2' ] } }, { nickname: 'system-test' }, (error, res) => {
//   console.log('res: ', res);
// });
// Room.updateMany({ room_number: { $in: ['1', '2'] } }, { room_name: '노드' }, (error, res) => {
//   console.log('res: ', res);
// });

// const User = require('../models/user');
// User.updateOne({ user_id: 1, nickname: '닉넴변경함' }, { $addToSet: { rooms: 4 } }, (error, res) => {
//   console.log('#res: ', res);
// });

// User.findOne({ user_id: 1, nickname: '닉넴변경함' }, (error, res) => {
//   console.log('##res: ', res.rooms);
// });
