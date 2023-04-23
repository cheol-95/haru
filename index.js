const express = require('express');
const app = express();

// GET 메서드로 / 경로에 대한 요청 처리
app.get('/', function(req, res) {
  res.send('Hello World!');
});

// GET 메서드로 /about 경로에 대한 요청 처리
app.get('/about', function(req, res) {
  res.send('About Page');
});

// POST 메서드로 /user 경로에 대한 요청 처리
app.post('/user', function(req, res) {
  res.send('User Created!');
});

// 404 에러 처리
app.use(function(req, res, next) {
  res.status(404).send('Not Found');
});

// 서버 실행
app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
