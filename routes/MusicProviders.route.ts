import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import dependecies */
var SpotifyWebApi = require('spotify-web-api-node');

/** Import controllers */
const Host = require('../controller/Host.controller');

router.get('/', async (req: Request, res: Response) => {
    try {
        const musicProviders = await Host.getMusicProviders();
        res.send(musicProviders);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send(error);
    }
})

router.get('/spotify', async (req: Request, res: Response) => {
    try {
        const { device } = req.query;
        if(!device) res.status(403).send({ message: "Missing device parameter"});

        const scopes = ['user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'app-remote-control', 'streaming', 'user-read-email', 'user-read-private', 'user-library-modify', 'user-library-read'],
            spotifyApi = new SpotifyWebApi({
                clientId: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
                redirectUri: process.env.SPOTIFY_REDIRECT_URI
            });
        const authorizeURL = spotifyApi.createAuthorizeURL(scopes, `${res.locals.userId}|${device}`);
        res.send({ authorizeURL })
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send(error);
    }
});

module.exports = router;