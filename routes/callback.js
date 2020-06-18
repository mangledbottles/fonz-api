var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var request = require('request'); // "Request" library
var SpotifyWebApi = require('spotify-web-api-node');

router.get('/spotify', function(req, res, next) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[process.env.SPOTIFY_STATE_KEY] : null;

  if (state === null || state !== storedState) return res.status(400).json({ message: "Error: State mismatch." });

  res.clearCookie(process.env.SPOTIFY_STATE_KEY);
  var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  });
  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(code).then( function(data) {
    const { expires_in, access_token, refresh_token } = data.body;
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);

    spotifyApi.getMe().then(function(data) {
      // user spotify information
      res.json({ access_token, refresh_token, expires_in, userInformation: data.body })
      }, function(err) {
        res.status(500).json({ message: "Error getting user information.", err });
    });
  }, function(err) {
    res.status(500).json({ message: "Error with auth code.", err });
  });
});

module.exports = router;
