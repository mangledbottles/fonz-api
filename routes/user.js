var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
const User = require("../controller/user");
const spotifyApi = new SpotifyWebApi();


router.get('/', (req, res, next) => {
  res.send("AUTHENTICATED");
})

router.get('/spotify', function(req, res, next) {
  if(res.locals.user.type == 'user') return res.status(403).json({ status: 403, message: "Forbidden. Only host accounts have the privilege to use this request. "});
  spotifyApi.setAccessToken(global.access_token);
  spotifyApi.getMe().then((data) => {
    res.json({ sid: res.locals.user.sid, userInformation: data.body })
  }).catch((err) => {
    res.status(500).json({ err })
  });
});


module.exports = router;
