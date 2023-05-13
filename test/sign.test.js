const should = require('should');
const request = require('supertest');
const app = require('../app');

describe('POST /v1/user'),
  () => {
    it('회원가입 테스트', done => {
      request(app)
        .post('/v1/user')
        .send({
          email: 'rkdcjf0122@naver.com',
          password: 'qlalfqjsgh',
          nickname: 'nickName',
        })
        .end((err, res) => {
          result = res.body;
          result.should.be.an.instanceOf(Object).and.have.property('message');
          result.message.should.be.an.instanceOf(String);
        });
      done();
    });
  };
