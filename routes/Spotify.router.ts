import express, { IRouter, NextFunction, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
const Session = require('../controller/Sessions.controller');
const Spotify = require('../controller/Spotify.controller');

/** Middleware Function to Validate Session */
router.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionId = req.baseUrl?.split('/')[2];
        const session = await Session.getSessionForGuest(sessionId);

        // console.log({ session })

        const {
            accessToken,
            refreshToken,
            lastUpdated,
            provider,
            providerId
        } = session.musicProviders;

        globalThis.Spotify = { accessToken, refreshToken, lastUpdated, provider, providerId };
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

router.get('/search', async (req: Request, res: Response) => {
    try {
        const {
            term,
            // limit,
            // offset
        } = req.query;

        if (!term) return res.status(400).json({
            status: 400,
            message: "Missing parameters.",
            requiredParams: ['term']
        });

        const searchResults = await Spotify.searchSong(term);

        return res.send({ searchResults })
        // Spotify.searchSong(term).then((resp) => {
        //     res.status(200).json(resp);
        // }).catch((err) => {
        //     res.status(500).json({
        //         err
        //     });
        // })
    } catch (error) {
        console.error(error)
        return res.status(error.status || 500).send(error)
    }
});
    }
});



module.exports = router;