const { boolean } = require('joi');
const should = require('should');
const request = require('supertest');
const app = require('../app');

const { rowSplit } = require('../utils/database');

describe('rowSplit 테스트', () => {
  describe('태그 모두 입력', () => {
    let result;
    before(() => {
      result = rowSplit(Data, ['project', 'apply']);
    });
    it('tag로 받은 하위 데이터의 자료형이 Array, 각 tag의 개수가 예측한 값과 맞는지', (done) => {
      result.should.be.an.instanceOf(Object).have.properties('project', 'apply');
      result.project.should.be.instanceOf(Array).and.have.lengthOf(3);
      result.apply.should.be.instanceOf(Array).and.have.lengthOf(1);
      done();
    });
    it('각 태그로 받은 하위 데이터의 누락 확인', (done) => {
      Object.keys(result.project[0]).should.have.lengthOf(3);
      Object.keys(result.apply[0]).should.have.lengthOf(2);
      done();
    });
  });

  describe('태그 한개만 입력', () => {
    let result;
    before(() => {
      result = rowSplit(Data, ['project']);
    });
    it('하위 데이터의 자료형, 예상한 값과 맞는지', (done) => {
      result.should.be.an.instanceOf(Object).have.properties('project');
      result.project.should.be.instanceOf(Array).and.have.lengthOf(3);
      done();
    });
    it('각 태그로 받은 하위 데이터의 누락 확인', (done) => {
      Object.keys(result.project[0]).should.have.lengthOf(3);
      done();
    });
  });

  describe('태그 미 입력', () => {
    it('파라미터 미 입력시 에러 발생여부', (done) => {
      rowSplit(Data);
      done();
    });
  });
});

const Data = [
  {
    id: 1,
    name: 'testName',
    image: 'image/user/sfa324ie12oaej.jpg',
    location: '서울시 서초구',
    email: 'rkdamsdf@naver.com',
    P_id: '1',
    P_name: 'Taru',
    P_title: '개발자들을 위한 스터디 앱',
    A_id: '1',
    A_name: 'Apply1',
  },
  {
    id: 1,
    name: 'testName',
    image: 'image/user/sfa324ie12oaej.jpg',
    location: '서울시 서초구',
    email: 'rkdamsdf@naver.com',
    P_id: '2',
    P_name: 'Manna',
    P_title: '지각쟁이 친구들의 지갑을 공유하는 앱',
    A_id: '1',
    A_name: 'Apply1',
  },
  {
    id: 1,
    name: 'testName',
    image: 'image/user/sfa324ie12oaej.jpg',
    location: '서울시 서초구',
    email: 'rkdamsdf@naver.com',
    P_id: '3',
    P_name: 'Kakao',
    P_title: '그냥 채팅 앱',
    A_id: '1',
    A_name: 'Apply1',
  },
];
