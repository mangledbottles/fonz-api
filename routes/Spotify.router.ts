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

        globalThis.Spotify = { access_token, refresh_token, lastUpdated, provider };
        globalThis._sessionId = sessionId;

        if (provider != "Spotify") res.status(401).json({
            status: 401,
            message: "This session does not have Spotify linked to it."
        })

        next();
    } catch (error) {
        res.status(error.status || 500).json(error);
    }
});

router.get('/search', (req: Request, res: Response) => {
    try {
        const {
            term,
            limit,
            offset
        } = req.query;

        if (!term) return res.status(400).json({
            status: 400,
            message: "Missing parameters.",
            requiredParams: ['term']
        });
        Spotify.searchSong(term).then((resp) => {
            res.status(200).json(resp);
        }).catch((err) => {
            res.status(500).json({
                err
            });
        })
    } catch (error) {
        res.status(500).send(error)
    }
});



module.exports = router;