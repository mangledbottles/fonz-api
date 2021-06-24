import express, { Application, NextFunction, Request, Response } from "express";
var cookieParser = require('cookie-parser');
var dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");

const app: Application = express();
const port: string = process.env.PORT;
const limiter = rateLimit({
    windowMs: process.env.LIMITER_TIMEOUT_RESET,
    max: process.env.LIMITER_MAX_REQUESTS
});
app.use(limiter);

// Remove X-Powered-By Express and add custom header
app.use((req: Request, res: Response, next: NextFunction) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('A-PWNER-MESSAGE', 'VGhpcyBpcyBhIHByaXZhdGUgQVBJClVuYXV0aG9yaXNlZCB1c2Ugd2lsbCBiZSBkZXRlY3RlZCwgYW5kIHdlIHdpbGwgZmluZCB5b3UsIHdhdGNoIG91dC4=')
    next();
})
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

/* Requests don't require authentication */
// app.use('/', indexRouter);
// app.use('/callback', callbackRouter);
// app.use('/auth', authenticationRouter);

// /** All requests after this require authentication */
// app.use(authChecker);
// app.use('/guest', guestRouter);
// app.use('/library', libraryRouter);
// app.use('/host', hostRouter);

/** All unknown URL requests managed here */
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 404,
        message: "Endpoint not found. Ensure that you have requested the correct URL."
    });
});

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});