var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-fonzi');
const spotifyApi = new SpotifyWebApi();

const coasterRoutes = require('./coaster/coaster.js');
const sessionRoutes = require('./session/session.js');
const Host = require('../controller/host');
const Spotify = require('../controller/spotify');

router.get('/providers', (req, res) => {
  Host.getProviders().then((providers) => {
    res.json({
      providers
    });
  }).catch((error) => {
    res.status(error.status || 500).json(error);
  })
});

// router.delete('/providers/:providerId', (req, res) => {
//   const { providerId } = req.params;
//   Host.removeProvider(providerId).then((resp) => {
//     res.json(resp);
//   }).catch((error) => {
//     res.status(error.status || 500).json(error);
//   });
// });

router.delete('/providers/spotify', (req, res) => {
  // const { providerId } = req.params;
  Host.removeProvider().then((resp) => {
    res.json(resp);
  }).catch((error) => {
    res.status(error.status || 500).json(error);
  });
});


router.get('/spotify', function (req, res, next) {
  // spotifyApi.setAccessToken(global.access_token);
  // Spotify.refreshAccessToken().then(() => {
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
  // })
  // .catch((err) => {
  //   res.status(500).json({
  //     err
  //   })
  // })
});

/* Coasters */
router.use('/coasters', coasterRoutes);

/* Sessions */
router.use('/session', sessionRoutes);

/* export module */
module.exports = router;