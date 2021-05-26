// Firebase Functions
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp({
    // credential: admin.credential.applicationDefault()
// });
// const db = admin.firestore();
// global.admin = admin;
// global.db = db;

// const Auth_BE_CAREFUL_VERY_PRIVATE = admin.auth();
// global.Auth_BE_CAREFUL_VERY_PRIVATE = Auth_BE_CAREFUL_VERY_PRIVATE;

// const Providers = global.db.collection('providers');
// // const SpotifyDB = Providers;
// // const SpotifyDB = Providers.doc('Spotify');
// const SessionsDB = db.collection('sessions');
// const CoastersDB = db.collection('coasters');

// global.SessionsDB = SessionsDB;
// global.Providers = Providers;
// // global.SpotifyDB = SpotifyDB;
// global.CoastersDB = CoastersDB;


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const rateLimit = require("express-rate-limit");

const indexRouter = require('./routes/index');
const authenticationRouter = require('./routes/authentication');
const callbackRouter = require('./routes/callback');
const hostRouter = require('./routes/host');
const libraryRouter = require('./routes/library');
const guestRouter = require('./routes/guest');

const app = express();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(logger('dev'));
app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('A-PWNER-MESSAGE', 'VGhpcyBpcyBhIHByaXZhdGUgQVBJClVuYXV0aG9yaXNlZCB1c2Ugd2lsbCBiZSBkZXRlY3RlZCwgYW5kIHdlIHdpbGwgZmluZCB5b3UsIHdhdGNoIG91dC4=')
    next()
})
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

/** Middleware function to verify valid JWT and that the session ID associated with JWT is active and valid **/
function authChecker(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({
        status: 401,
        message: "Authentication token missing"
    });
    const token = authHeader.split(' ')[1],
        payload = jwt.decode(token);

    admin.auth().verifyIdToken(token)
        .then((user) => {
            res.locals.user = user;
            global.userId = user.user_id;
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
app.use('/callback', callbackRouter);
app.use('/auth', authenticationRouter);

/** All requests after this require authentication */
app.use(authChecker);
app.use('/guest', guestRouter);
app.use('/library', libraryRouter);
app.use('/host', hostRouter);

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


app.listen(8080, () => {
    console.log(`Running on port 8080`);
  });

// exports.speedTest = functions.https.onRequest((req, res) => {
//     res.json({ message: 'Speed Test Fonz Music' })
// })