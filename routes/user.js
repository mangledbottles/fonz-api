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
  User.getAccessAndRefreshToken(res.locals.user.sid).then(({ access_token, refresh_token }) => {
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      res.json(data.body)
      console.log("Now Playing: ",data.body);
    }, function(err) {
      console.log('Something went wrong! getMyCurrentPlaybackState', err);
    });
  });
});

module.exports = router;
