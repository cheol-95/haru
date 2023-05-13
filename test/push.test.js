const should = require('should');
const request = require('supertest');
const app = require('../app');

const Room = require('../models/room');

describe('push-event', () => {
  before(() => {
    // 서버실행
    require('../bin/www');
  });

  it('send-offMembers - query', (done) => {
    Room.findOne({ study_id: 1 }).then(async (doc) => {
      doc.should.be.instanceOf(Object).and.have.property('off_members');
      doc.off_members.should.be.instanceOf(Object);
      done();
    });
  });
});

describe('push-dao', () => {
  before(() => {
    // 서버실행
    require('../bin/www');
  });

  it('getPushInfo', (done) => {
    const idList = [1, 2, 3, null, null, null, null, null, null, null];
    const pushDao = require('../dao/push');
    pushDao
      .getPushInfo(idList)
      .then((pushInfoRows) => {
        pushInfoRows.should.be.instanceOf(Object);
        pushInfoRows[0].should.have.property('device');
        pushInfoRows[0].should.have.property('push_token');
        done();
      })
      .catch((err) => {
        console.log('err: ', err);
      });
  }).timeout(5000);
});
