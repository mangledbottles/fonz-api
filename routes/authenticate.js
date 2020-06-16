var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ status: 200 });
});

router.get('/spotify', function(req, res, next) {
  // credentials are optional
  var scopes = ['user-read-private', 'user-read-email'],
  state = generateRandomString(16),
  stateKey = 'spotify_auth_state',
  spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/callback/spotify'
  });
  res.cookie(stateKey, state);
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
  res.json({ message: "spotify", authorizeURL });
});


module.exports = router;
