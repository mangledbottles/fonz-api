var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const rateLimit = require("express-rate-limit");

var indexRouter = require('./routes/index');
var authenticateRouter = require('./routes/authenticate');
var callbackRouter = require('./routes/callback');
var userRouter = require('./routes/user');
const libraryRouter = require('./routes/library');
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: false
}));


/** Middleware function to verify valid JWT and that the session ID associated with JWT is active and valid **/
function authChecker(req, res, next) {
  const User = require("./controller/user"), authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ status: 401, message: "JWT Authentication token missing" });
  const token = authHeader.split(' ')[1], payload = jwt.decode(token);

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, user) => {
    if (err) return res.status(403).json({ status: 403, message: "Invalid JWT Authentication token provided. Your token may have expired, login again to get a new token.", loginRequired: true, err });
    User.isValidSession(user).then((isValidSession) => {
      if(!isValidSession) return res.status(403).json({ status: 403, message: "Invalid JWT Authentication token provided. This session has been deactivated, login again to get a new token.", loginRequired: true });
      // spotifyApi.setAccessToken(global.access_token);
      // spotifyApi.setRefreshToken(global.refresh_token);
      res.locals.user = user;
      next();
    }).catch((err) => {
      return res.status(500).json({ err, location: "isValidSession" });
    })
  });
}

app.use('/', indexRouter);
app.use('/authenticate', authenticateRouter);
app.use('/callback', callbackRouter);
/** All requests after this require authentication */
app.use(authChecker);
app.use('/library', libraryRouter);
app.use('/user', userRouter);

/** All unknown URL requests managed here */
app.use(function(req, res, next) {
  res.status(404).json({ status:404, message: "404 NOT FOUND Ensure that you have requested the correct URL." });
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log({ err })
  res.json({ error: err, message: err.message });
});

module.exports = app;
