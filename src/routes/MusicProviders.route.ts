import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();
const NAMESPACE = "MusicProviders"

/** Import dependecies */
var SpotifyWebApi = require('spotify-web-api-node');

/** Import controllers */
const Host = require('../controller/Host.controller');

router.get('/', async (req: Request, res: Response) => {
    globalThis.Logger.log('info', `[${NAMESPACE}] User getting their Music Providers `, { ...globalThis.LoggingParams })

    try {
        const musicProviders = await Host.getMusicProviders();
        res.send(musicProviders);
    } catch (error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Get users Music Providers`, { ...globalThis.LoggingParams, error },)

        res.status(error.status || 500).send(error);
    }
})

router.get('/spotify', async (req: Request, res: Response) => {
    globalThis.Logger.log('info', `[${NAMESPACE}] User requesting auth link to add Spotify `, { ...globalThis.LoggingParams })

    try {
        const { device } = req.query;
        if(!device) res.status(403).send({ message: "Missing device parameter"});

        const scopes = ['user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'app-remote-control', 'streaming', 'user-read-email', 'user-read-private', 'user-library-modify', 'user-library-read', 'user-top-read', 'ugc-image-upload', 'user-read-recently-played', 'user-read-playback-position', 'playlist-modify-public', 'playlist-modify-private', 'playlist-read-collaborative', 'user-follow-modify', 'user-follow-read'],
            spotifyApi = new SpotifyWebApi({
                clientId: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
                redirectUri: process.env.SPOTIFY_REDIRECT_URI
            });
        const authorizeURL = spotifyApi.createAuthorizeURL(scopes, `${res.locals.userId}+${device}`);
        res.send({ authorizeURL })
    } catch (error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Get auth link to add Spotify `, { ...globalThis.LoggingParams, error },)

        res.status(error.status || 500).send(error);
    }
});

module.exports = router;