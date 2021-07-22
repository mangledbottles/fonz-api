import express, { IRouter, NextFunction, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
const Session = require('../controller/Sessions.controller');

/** Middleware Function to Validate Session */
router.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionId = req.baseUrl?.split('/')[2];
        const session = await Session.getSessionForGuest(sessionId);

        console.log({ session })

        next();    
    } catch(error) {
        res.status(error.status || 500).json(error);
    }
});

router.get('/', (req: Request, res: Response) => {
    res.send({ message: "Guest Router"})
})


module.exports = router;