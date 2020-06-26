var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-fonzi');
const User = require("../controller/user");
const spotifyApi = new SpotifyWebApi();


router.get('/', (req, res, next) => {
  res.send("AUTHENTICATED");
})

router.get('/spotify', function(req, res, next) {
  spotifyApi.setAccessToken(global.access_token);
  spotifyApi.getMe().then((data) => {
    res.json({ sid: res.locals.user.sid, userInformation: data.body })
  }).catch((err) => {
    res.status(500).json({ err })
  });
});

router.get('/spotify/current', function(req, res, next) {
  spotifyApi.setAccessToken(global.access_token);
  spotifyApi.getMyCurrentPlaybackState().then((data) => {
    res.status(200).json(data.body);
  }).catch((err) => {
    res.status(500).json({ err });
  });
});

module.exports = router;
