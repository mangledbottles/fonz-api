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

module.exports = router;
