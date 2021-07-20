import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
// const Session = require('../controller/Sessions.controller');

/** Middleware Function to Validate Session */
async function ValidSession(req: Request, res: Response, next: NextFunction) {
    
    next();    
}

router.get('/', (req: Request, res: Response) => {
    res.send({ message: "Guest Router"})
})


module.exports = router;