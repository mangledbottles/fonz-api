import express, { IRouter, NextFunction, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
const Session = require('../controller/Sessions.controller');

/** Middleware Function to Validate Session */
router.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionId = req.baseUrl?.split('/')[2];
        const session = await Session.getSessionForGuest(sessionId);

        const {
            access_token,
            refresh_token,
            lastUpdated,
            provider
        } = session.musicProviders;

        res.locals.musicProvider = { access_token, refresh_token, lastUpdated, provider };

        if (provider != "Spotify") {
            res.status(401).json({
                status: 401,
                message: "This session does not have Spotify linked to it."
            })
        } else {
            next();
        }

    } catch (error) {
        res.status(error.status || 500).json(error);
    }
});

router.get('/', (req: Request, res: Response) => {
    res.send({ message: "Guest Router" })
})


module.exports = router;