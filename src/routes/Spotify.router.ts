import express, { IRouter, NextFunction, Request, Response } from "express";
var router: IRouter = express.Router();
const NAMESPACE = "Spotify";

/** Import controllers */
const Session = require('../controller/Sessions.controller');
const Spotify = require('../controller/Spotify.controller');

/** Middleware Function to Validate Session */
router.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sessionId = req.baseUrl?.split('/')[2];
        const session = await Session.getSessionForGuest(sessionId);

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
            offset
        } = req.query;

        globalThis.Logger.log('info', `[${NAMESPACE}] User searching Song  `, { ...globalThis.LoggingParams, params: { term, offset } })


        if (!term) return res.status(400).json({
            status: 400,
            message: "Missing parameters.",
            requiredParams: ['term']
        });

        const searchResults = await Spotify.searchSong(term, offset);

        return res.send({ searchResults })
    } catch (error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not search for Song `, { ...globalThis.LoggingParams, error })

        return res.status(error.status || 500).send(error)
    }
});

router.get('/search/top', async (req: Request, res: Response) => {
    try {
        const { type, offset, limit } = req.query;
        globalThis.Logger.log('info', `[${NAMESPACE}] User getting Top Songs  `, { ...globalThis.LoggingParams, params: { type, offset, limit } })

        if(!type) return res.status(403).send({ message: "Search top not provided"});
        const results = await Spotify.getGuestTop(type, offset, limit);
        return res.send(results);
    } catch(error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Get Top Songs `, { ...globalThis.LoggingParams, error })

        return res.status(error.status || 500).send(error)
    }
})

router.get('/search/artist/:artistId', async (req: Request, res: Response) => {
    try {
        const { artistId } = req.params;
        if(!artistId) return res.status(403).send({ message: "Artist ID not provided"});
        globalThis.Logger.log('info', `[${NAMESPACE}] User searching by Artist ID  `, { ...globalThis.LoggingParams, params: { artistId } })


        const results = await Spotify.getTracksByArtistId(artistId);
        return res.send(results);
    } catch(error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not search by Artist ID `, { ...globalThis.LoggingParams, error })

        return res.status(error.status || 500).send(error)
    }
})

router.get('/search/playlist/:playlistId', async (req: Request, res: Response) => {
    try {
        const { playlistId } = req.params;
        const { offset, limit } = req.query;
        if(!playlistId) return res.status(403).send({ message: "Playlist ID not provided"});
        globalThis.Logger.log('info', `[${NAMESPACE}] User searching by Playlist ID  `, { ...globalThis.LoggingParams, params: { offset, limit, playlistId } })


        const results = await Spotify.getTracksByPlaylistId(playlistId, offset, limit);
        return res.send(results);
    } catch(error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not search by Playlist ID `, { ...globalThis.LoggingParams, error })

        return res.status(error.status || 500).send(error)
    }
})

router.get('/search/releases', async (req: Request, res: Response) => {
    try {
        globalThis.Logger.log('info', `[${NAMESPACE}] User getting Spotify Releases  `, { ...globalThis.LoggingParams })

        const results = await Spotify.getNewReleases();
        return res.send(results);
    } catch(error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not get Spotify Releases `, { ...globalThis.LoggingParams, error })
        
        return res.status(error.status || 500).send(error)
    }
})

router.get('/state', async (req: Request, res: Response) => {
    try {
        globalThis.Logger.log('info', `[${NAMESPACE}] User getting Session State and Active Song  `, { ...globalThis.LoggingParams })
        
        const currentSong = await Spotify.getCurrent();
        return res.send(currentSong);
    } catch (error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Get Session State and Active Song `, { ...globalThis.LoggingParams, error })

        return res.status(error.status || 500).send(error)
    }
});

/** Spotify add song to queue */
router.post('/queue/:songUri', (req: Request, res: Response) => {
    try {
        const {
            songUri
        } = req.params;
        const {
            device_id
        } = req.query;
        if (songUri.split(':')[1] != 'track') res.status(400).json({
            status: 400,
            message: "An invalid track has been provided. Must be informat of 'spotify:track:TRACKID'. "
        });
        if (!songUri) res.status(400).json({
            status: 400,
            message: "Missing parameters.",
            requiredParams: ['songUri', 'device_id']
        });

        globalThis.Logger.log('info', `[${NAMESPACE}] User adding Song to Queue  `, { ...globalThis.LoggingParams, params: { songUri, device_id } })


        Spotify.addToQueue(songUri, device_id).then((resp) => {
            res.status(200).json((resp.length == 0 || resp.length == undefined) ? {
                status: 200,
                message: "Song queued."
            } : resp);
        }).catch((error) => {
            globalThis.Logger.log('error', `[${NAMESPACE}] Could not add Song to Queue `, { ...globalThis.LoggingParams, error })

            res.status(error.status || 500).json(error);
        })
    } catch (error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not add Song to Queue `, { ...globalThis.LoggingParams, error })

        res.status(error.status || 500).send(error);
    }
});

module.exports = router;