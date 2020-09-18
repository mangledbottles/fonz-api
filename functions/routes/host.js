var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-fonzi');
const spotifyApi = new SpotifyWebApi();

const coasterRoutes = require('./coaster/coaster.js');
const sessionRoutes = require('./session/session.js');

router.get('/', (req, res, next) => {
  Host.getSpotifyAccessAndRefreshToken('1').then((tokens) => {
    res.json(tokens)
  }).catch((error) => {
    res.status(error.status || 500).json(error);
  })
});

router.get('/spotify', function (req, res, next) {
  spotifyApi.setAccessToken(global.access_token);
  spotifyApi.getMe().then((data) => {
    res.json({
      sid: res.locals.user.sid,
      userInformation: data.body
    })
  }).catch((err) => {
    res.status(500).json({
      err
    })
  });
});

/* Coasters */
router.use('/coasters', coasterRoutes);

/* Sessions */
router.use('/session', sessionRoutes);

/* export module */
module.exports = router;