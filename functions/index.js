// Firebase Functions
const functions = require('firebase-functions');
const admin = require('firebase-admin');
global.admin = admin;

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
var authenticationRouter = require('./routes/authentication');
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
    const User = require("./controller/user"),
        authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({
        status: 401,
        message: "Authentication token missing"
    });
    const token = authHeader.split(' ')[1],
        payload = jwt.decode(token);

    admin.auth().verifyIdToken(token)
        .then((user) => {
            res.locals.user = user;
            next()
        }).catch((error) => {
            return res.status(403).json({
                status: 403,
                message: "Invalid access token has been provided",
                error
            })
        });
}

app.use('/', indexRouter);
// app.use('/test', userRouter);

/* TODO: 
 *   [*] Rename authenticate to add music provider
 *   [] Accept access token as GET param for adding music provider
 *   [] Update endpoints to query Firestore db
 *   [] Create new endpoints for viewing active sessions
 *   [] Create endpoint to create new session
 *   [] Turn on / off all coasters
 */

app.use('/auth', authenticationRouter);
app.use('/callback', callbackRouter);

/** All requests after this require authentication */
app.use(authChecker);
app.use('/library', libraryRouter);
app.use('/user', userRouter);

/** All unknown URL requests managed here */
app.use(function (req, res, next) {
    res.status(404).json({
        status: 404,
        message: "Endpoint not found. Ensure that you have requested the correct URL."
    });
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log({
        err
    })
    res.json({
        error: err,
        message: err.message
    });
});

// module.exports = app;
exports.api = functions
    .https
    .onRequest(app);