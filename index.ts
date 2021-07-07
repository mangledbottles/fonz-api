import express, { Application, NextFunction, Request, Response, Router } from "express";
import logging from './config/logging';

/** Import Authentication Checker */
// const AuthChecker = require('./routes/AuthChecker')
import extractJWT from './middleware/extractJWT';

/** Import dependecies */
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const logger = require('morgan');

/** Initialise API Application and Port */
const app: Application = express();
const prod: boolean = process.env.NODE_ENV === 'production';
const port: string = prod ? "443" : process.env.PORT;
const NAMESPACE = 'Server';

/** Remove X-Powered-By Express and add custom header */
app.use((req: Request, res: Response, next: NextFunction) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('A-PWNER-MESSAGE', 'VGhpcyBpcyBhIHByaXZhdGUgQVBJClVuYXV0aG9yaXNlZCB1c2Ugd2lsbCBiZSBkZXRlY3RlZCwgYW5kIHdlIHdpbGwgZmluZCB5b3UsIHdhdGNoIG91dC4=')

    /** Log the req */
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        /** Log the res */
        logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
})
const limiter = rateLimit({
    windowMs: process.env.LIMITER_TIMEOUT_RESET,
    max: process.env.LIMITER_MAX_REQUESTS
});
app.use(limiter);
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

/** Routes */
const IndexRoute: Router = require('./routes/Index.route');
const AuthenticationRoute: Router = require('./routes/Auth.route');
const HostRoute: Router = require('./routes/Host.route');

/** Requests don't require authentication */
app.use('/', IndexRoute);
app.use('/auth', AuthenticationRoute);
// app.use('/callback', callbackRouter);

/** All requests after this require authentication */
app.use(extractJWT);
app.use('/host', HostRoute);
// app.use('/guest', guestRouter);
// app.use('/library', libraryRouter);

/** All unknown URL requests managed here */
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 404,
        message: "Endpoint not found. Ensure that you have requested the correct URL."
    });
});

try {
    app.listen(port, (): void => {
        console.log(`Server Running https://localhost:${port}`);
    });
} catch (error) {
    console.error(`Error occurred: ${error.message}`);
}