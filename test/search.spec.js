const should = require('should');
const request = require('supertest');
const app = require('../app');

const token = process.env.access_token;

describe('스터디 검색 API', () => {
  it('word -> title 와일드카드 %word%', (done) => {
    request(app)
      .get('/v1/study/search')
      .set({ Authorization: `Bearer ${token}` })
      .query('word=s7&category=ios')
      .end((err, res) => {
        res.body.should.be.an.instanceOf(Object);
        done();
      });
  });

  it('쿼리스트링 적용', (done) => {
    request(app)
      .get('/v1/study/search')
      .set({ Authorization: `Bearer ${token}` })
      .query('word=s7&category=ios&sigungu')
      .end((err, res) => {
        res.body.should.be.an.instanceOf(Object);
        done();
      });
  });

  it('쿼리스트링 sigungu 제외 -> 와일드카드', (done) => {
    request(app)
      .get('/v1/study/search')
      .set({ Authorization: `Bearer ${token}` })
      .query('word=s7&category=ios')
      .end((err, res) => {
        res.body.should.be.an.instanceOf(Object);
        done();
      });
  });
});

describe('핫 등록 키워드', () => {
  it('정상값 테스트', (done) => {
    request(app)
      .get('/v1/study/ranking')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.body.should.be.an.instanceOf(Object);
        done();
      });
  });
});
