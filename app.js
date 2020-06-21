var express = require('express');
// var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var authenticateRouter = require('./routes/authenticate');
var callbackRouter = require('./routes/callback');
var userRouter = require('./routes/user');

const app = express();

// app.set('view engine', 'html');
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', indexRouter);
app.use('/authenticate', authenticateRouter);
app.use('/callback', callbackRouter);
app.use('/user', userRouter);

/** all unknown URL requests managed here */
app.use(function(req, res, next) {
  res.status(404);
  res.json(
      { status:404, message: "This requested API URL does not exist. Ensure that you have requested the correct URL."},
      404
  );
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log({ err })
  res.json({ error: err });
});

module.exports = app;
