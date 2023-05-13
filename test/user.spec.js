const should = require('should');
const request = require('supertest');
const app = require('../app');

describe('회원가입 API', () => {
  it.skip('가입 성공 (201)', (done) => {
    request(app)
      .post('/v1/user')
      .send({ email: 'email@email.com', nickname: 'testN', password: 'password123' })
      .end((err, res) => {
        res.statusCode.should.be.equal(201);
      });
    done();
  });
  describe('유효성 검사 테스트', () => {
    it('이메일 유효성 에러 (422)', (done) => {
      request(app)
        .post('/v1/user')
        .send({ email: 'test123email.com', nickname: 'testN', password: 'password123' })
        .end((err, res) => {
          res.statusCode.should.be.equal(422);
          res.body.message.should.be.equal('"email" must be a valid email');
        });
      done();
    });
    it('닉네임 유효성 에러 (422)', (done) => {
      request(app)
        .post('/v1/user')
        .send({ email: 'test123@email.com', nickname: 'testNickname', password: 'password123' })
        .end((err, res) => {
          res.statusCode.should.be.equal(422);
          res.body.message.should.be.equal('"nickname" length must be less than or equal to 8 characters long');
        });
      done();
    });
    it('비밀번호 미 입력시 에러 (422)', (done) => {
      request(app)
        .post('/v1/user')
        .send({ email: 'test123@email.com', nickname: 'testN', password: '' })
        .end((err, res) => {
          res.statusCode.should.be.equal(422);
          res.body.message.should.be.equal('"password" is not allowed to be empty');
        });
      done();
    });
  });
});

describe('유저 조회 API', () => {
  describe('성공', () => {
    it('리다이렉션 (303)', (done) => {
      request(app)
        .post('/v1/user/login')
        .send({
          email: 'rkdcjf0122@naver.com',
          password: 'qlalfqjsgh',
        })
        .end((err, res) => {
          res.statusCode.should.be.equal(303);
        });
      done();
    });
  });
  describe('실패', () => {
    it('없는 이메일 (400)', (done) => {
      request(app)
        .post('/v1/user/login')
        .send({
          email: 'rkd8431@naver.com',
          password: 'qlalfqjsgh123',
        })
        .end((err, res) => {
          const message = res.body.message.split(': ')[1];
          message.should.be.equal('auth/user-not-found');
          res.statusCode.should.be.equal(400);
        });
      done();
    });
    it('비밀번호 오류 (400)', (done) => {
      request(app)
        .post('/v1/user/login')
        .send({
          email: 'rkdcjf0122@naver.com',
          password: 'qlalfqjsgh123',
        })
        .end((err, res) => {
          const message = res.body.message.split(': ')[1];
          message.should.be.equal('auth/wrong-password');
          res.statusCode.should.be.equal(400);
        });
      done();
    });
  });
});

describe('유저조회 API', () => {
  it('데이터 타입 Object (200)', (done) => {
    request(app)
      .get('/v1/user/1')
      .end((err, res) => {
        res.statusCode.should.be.equal(200);
      });
    done();
  });
});

describe('유저정보 수정 API', () => {
  it('리다이렉션 (303)', (done) => {
    request(app)
      .patch('/v1/user/1')
      .send({
        sns_web: 'test@naver.com',
      })
      .end((err, res) => {
        console.log('res.body: ', res.body);
        res.statusCode.should.be.equal(303);
      });
    done();
  });
});
