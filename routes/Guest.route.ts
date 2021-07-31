import express, { IRouter, Request, Response, Router } from "express";
var router: IRouter = express.Router();

/** Import routers */
const SpotifyRouter: Router = require('./Spotify.router');

/** Import controllers */
const Session = require('../controller/Sessions.controller');

/* Coasters */
router.get('/coaster/:coasterId', async (req: Request, res: Response) => {
    try {
        const { coasterId } = req.query;
        const session = await Session.getCoasterSessionForGuest(coasterId);
        res.send(session)
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json(error);
    }
})

/* Session */
router.use('/:sessionId/spotify', SpotifyRouter);

module.exports = router;