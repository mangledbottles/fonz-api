import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
// const Coaster = require('../controller/Coasters.controller');

router.get('/', (req: Request, res: Response) => {
    res.send({ message: 1234 })
});