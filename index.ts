import express, { Application, NextFunction, Request, Response, Router } from "express";

/* Import dependecies */
const jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
const logger = require('morgan');

// const AuthChecker = (req: Request, res: Response, next: NextFunction) => {
const AuthChecker = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({
            status: 401,
            message: "Authentication token missing"
        });
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
            if(err) {
                let resp;
                switch(err.message) {
                    case 'invalid signature':
                        resp = { message: "Authentication not valid." }
                        break;
                    case 'jwt expired':
                        resp = { message: "Authentication token expired.", expiredAt: err.expiredAt }
                        break;
                 
                    default:
                        

                }
                res.status(401).send(resp);
            }
            next();
        });
               
    } catch (err) {
        res.status(500).json({
            message: "Could not authenticate."
        });
    }
}

/* Initialise API Application and Port */
const app: Application = express();
const port: string = process.env.PORT;

// Remove X-Powered-By Express and add custom header
app.use((req: Request, res: Response, next: NextFunction) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('A-PWNER-MESSAGE', 'VGhpcyBpcyBhIHByaXZhdGUgQVBJClVuYXV0aG9yaXNlZCB1c2Ugd2lsbCBiZSBkZXRlY3RlZCwgYW5kIHdlIHdpbGwgZmluZCB5b3UsIHdhdGNoIG91dC4=')
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

/* Routes */
const IndexRoute: Router = require('./routes/Index.route');
const AuthenticationRoute: Router = require('./routes/Auth.route');
const HostRoute: Router = require('./routes/Host.route');

/** Requests don't require authentication */
app.use('/', IndexRoute);
app.use('/auth', AuthenticationRoute);
// app.use('/callback', callbackRouter);

/** All requests after this require authentication */
app.use(AuthChecker);
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