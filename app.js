const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const router = require('./routes');
const { verify } = require('./middlewares/auth');
const { stream } = require('./configs/winston');
const { parseRequest } = require('./middlewares/validators/common');

require('./configs/morgan');

const app = express();

app.set('trust proxy', true);
app.use(morgan('customFormat', { stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(parseRequest);
app.use(verify);

app.use('/', router);
// app.use(express.static(__dirname + '/../public'));

require('./middlewares/error_handler')(app);

module.exports = app;
