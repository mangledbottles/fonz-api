import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import dependecies */
var SpotifyWebApi = require('spotify-web-api-node');

router.get('/spotify', async (req: Request, res: Response) => {
    try {
        const scopes = ['user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'app-remote-control', 'streaming', 'user-read-email', 'user-read-private', 'user-library-modify', 'user-library-read'],
            stateKey = process.env.SPOTIFY_STATE_KEY,
            spotifyApi = new SpotifyWebApi({
                clientId: process.env.SPOTIFY_CLIENT_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
                redirectUri: process.env.SPOTIFY_REDIRECT_URI
            });

        res.cookie(stateKey, res.locals.userId);
        const authorizeURL = spotifyApi.createAuthorizeURL(scopes, res.locals.userId);
        res.send({ authorizeURL })
        // res.redirect(authorizeURL);

    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send(error);
    }
});

module.exports = router;