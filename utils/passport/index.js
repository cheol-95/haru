const passport = require('passport');
// const local = require('./localStrategy'); // 로컬서버로 로그인할때
const kakao = require('./kakaoStrategy'); // 카카오서버로 로그인할때

// const User = require('../models/user');

module.exports = () => {
   // passport.serializeUser((user, done) => {
   //  console.log('user: ', user);
   //    done(null, user.id);
   // });

   // passport.deserializeUser((id, done) => {
   //  console.log('id: ', id);
   //    // //? 두번 inner 조인해서 나를 팔로우하는 followerid와 내가 팔로우 하는 followingid를 가져와 테이블을 붙인다
   //    // User.findOne({ where: { id } })
   //    //    .then(user => done(null, user))
   //    //    .catch(err => done(err));
   // }); 

  //  local();
   kakao(); // 카카오 전략 등록
};