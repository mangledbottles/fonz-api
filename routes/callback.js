var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');

router.get('/spotify', function(req, res, next) {
  res.send("OKAY");
});

module.exports = router;
