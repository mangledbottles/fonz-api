var express = require('express');
var router = express.Router();
const User = require('../controller/user');
const Spotify = require('../controller/spotify');


router.get('/spotify', (req, res) => {
  const { code, state } = req.query;
  var storedState = req.cookies ? req.cookies[process.env.SPOTIFY_STATE_KEY] : null;
  if (state === null || state !== storedState) return res.status(400).json({ message: "Error: State mismatch." });
  res.clearCookie(process.env.SPOTIFY_STATE_KEY);

  Spotify.authorizeUser(code).then(({ email, display_name, product, country, spotifyId, expires_in, access_token, refresh_token }) => {
    User.generateJWT('Spotify', email, access_token, refresh_token, spotifyId, product, display_name).then((jwt) => {
      res.status(200).json({ jwt, email, display_name });
    });
  }).catch((err) => {
    res.send({ status: 500, message: "An internal error has occurred.", details: err, location: "Spotify Authorize User"});
  });
})

/*
router.get('/spotify2', function(req, res) {
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
      // console.log({ data: data.body})
      const { email, display_name, product } = data.body;
      console.log(email, display_name, product);
      User.generateJWT('Spotify', email, access_token, refresh_token).then((res) => {
        console.log(res);
        res.send({ message: "OKAY" })
        // res.send({ access_token, refresh_token, expires_in, userInformation: data.body })
      }).catch((e) => {
            res.send({ status: 500, message: "An internal error has occurred.", details: e})
            // console.log({res})
            // res.json({ status: 500, message: "An internal error has occurred.", details: e})
            console.log('Exception catch {userRoutes} ', e)
      });
    }, function(err) {
        res.status(500).json({ message: "Error getting user information.", err });
    });
  }, function(err) {
    res.status(500).json({ message: "Error with auth code.", err });
  });
});
*/

module.exports = router;
