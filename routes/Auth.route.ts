import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
const Auth = require('../controller/Auth.controller');
// var SpotifyWebApi = require('spotify-web-api-node');
// const User = require('../controller/host');
// const Spotify = require('../controller/spotify');


router.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password })
    Auth.signIn(email, password).then((details) => {
      res.send(details);
    }).catch((error) => {
      res.status(error.status || 500).send(error);
    });
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.get('/coasters', async (req: Request, res: Response) => {
  const coasters = await Auth.getCoasters();
  res.send(coasters);
});

/*
router.get('/spotify', async (req, res, next) => {
  const {
    token
  } = req.query;
  if (!token) return res.status(401).json({
    status: 401,
    message: "Access token is missing."
  });

  global.admin.auth().verifyIdToken(token).then((user) => {
    const scopes = ['user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'app-remote-control', 'streaming', 'user-read-email', 'user-read-private', 'user-library-modify', 'user-library-read'],
      state = generateRandomString(16),
      stateKey = process.env.SPOTIFY_STATE_KEY,
      spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.SPOTIFY_REDIRECT_URI
      });
    const userId = user.uid;
    console.log({user})
    // console.log(userId)
    res.cookie(stateKey, userId);
    var authorizeURL = spotifyApi.createAuthorizeURL(scopes, userId);
    res.redirect(authorizeURL);
  }).catch((error) => {
    res.send(error);
  })
});
*/

module.exports = router;