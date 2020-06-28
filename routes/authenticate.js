var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-fonzi');

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

router.get('/', function(req, res, next) {
  res.json({ status: 200 });
});

router.get('/spotify', function(req, res, next) {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-modify',
    'user-library-read',
    'app-remote-control',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-modify-playback-state',
    'user-library-modify',
    'app-remote-control',
  ],
  state = generateRandomString(16),
  stateKey = process.env.SPOTIFY_STATE_KEY,
  spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  });
  res.cookie(stateKey, state);
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.redirect(authorizeURL);
});


module.exports = router;
