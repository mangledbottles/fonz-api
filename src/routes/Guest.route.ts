import express, { IRouter, Request, Response, Router } from "express";
var router: IRouter = express.Router();
const NAMESPACE = "Guest";

/** Import routers */
const SpotifyRouter: Router = require('./Spotify.router');

/** Import controllers */
const Session = require('../controller/Sessions.controller');

/* Coasters */
router.get('/coaster/:coasterId', async (req: Request, res: Response) => {
    const { coasterId } = req.params;
    try {
        globalThis.Logger.log('info', `[${NAMESPACE}] Guest Getting Coaster information `, { ...globalThis.LoggingParams, coasterId})

        const session = await Session.getCoasterSessionForGuest(coasterId);
        res.send(session)
    } catch (error) {

        globalThis.Logger.log('error', `[${NAMESPACE}] Guest could not Get Coaster information `, { ...globalThis.LoggingParams, coasterId, error },)
        res.status(error.status || 500).json(error);
    }
})

/* Session */
router.use('/:sessionId/spotify', SpotifyRouter);

module.exports = router;