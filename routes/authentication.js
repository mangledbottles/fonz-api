var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-fonzi');
const User = require('../controller/host');
const Spotify = require('../controller/spotify');

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

router.get('/', function (req, res, next) {
  res.json({
    status: 200
  });
});

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

module.exports = router;