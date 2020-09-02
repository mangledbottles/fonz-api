var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-fonzi');
const User = require('../controller/user');
const Spotify = require('../controller/spotify');
const {
  userRecordConstructor
} = require('firebase-functions/lib/providers/auth');

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

router.get('/spotify', function (req, res, next) {
  const {
    token
  } = req.query;
  if (!token) return res.status(401).json({
    status: 401,
    message: "Access token is missing."
  })

  global.admin.auth().verifyIdToken(token)
    .then((user) => {
      const scopes = ['user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing', 'app-remote-control', 'streaming', 'user-read-email', 'user-read-private', 'user-library-modify', 'user-library-read'],
        state = generateRandomString(16),
        stateKey = process.env.SPOTIFY_STATE_KEY,
        spotifyApi = new SpotifyWebApi({
          clientId: process.env.SPOTIFY_CLIENT_ID,
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
          redirectUri: process.env.SPOTIFY_REDIRECT_URI
        });
      const {
        uid
      } = user;
      res.cookie(stateKey, uid);
      var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
      res.redirect(authorizeURL);
    }).catch((error) => {
      return res.status(403).json({
        status: 403,
        message: "Invalid access token has been provided",
        error
      })
    });


});

router.get('/spotify/user/:sid', (req, res, next) => {
  const {
    sid
  } = req.params;
  User.userIsSessionActive(sid).then((resp) => {
    if (!resp.active) return res.status(404).json({
      status: 404,
      message: "This session is not live / does not exist. "
    });
    User.generateUserJWT('Spotify', sid).then(({
      token,
      sid
    }) => {
      res.status(200).json({
        jwt: token,
        sid
      });
    }).catch((e) => {
      res.status(500).json({
        status: 500,
        message: "Error generating JWT.",
        e
      });
    });
  }).catch((err) => {
    res.status(500).json({
      status: 500,
      message: "Error getting information about the session ID.",
      err
    });
  })
});


module.exports = router;