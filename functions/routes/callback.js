var express = require('express');
var router = express.Router();
const User = require('../controller/user');
const Spotify = require('../controller/spotify');

router.get('/spotify', (req, res) => {
  const { code, state } = req.query;
  // var storedState = req.cookies ? req.cookies[process.env.SPOTIFY_STATE_KEY] : null;
  // if (state === null || state !== storedState) return res.status(400).json({ message: "Error: State mismatch." });
  res.clearCookie(process.env.SPOTIFY_STATE_KEY);
  try {
  Spotify.authorizeUser(code).then(({ email, display_name, product, country, spotifyId, expires_in, access_token, refresh_token }) => {
    User.generateJWT('Spotify', email, access_token, refresh_token, spotifyId, product, display_name).then(({ token, sid }) => {
      res.set({
        'Auth-JWT': token,
        'Auth-SessionId': sid,
        'Auth-DisplayName': display_name,
        'Auth-Email': email
      });
      res.redirect(`/?jwt=${token}`);
      // res.status(200).json({ jwt: token, email, display_name, sid });
    }).catch((e) => {
      res.status(500).json({ status: 500, message: "Error generating JWT.", e });
    })
  }).catch((details) => {
    res.send({ status: 500, message: "An internal error has occurred.", details, location: "Spotify Authorize User"});
  });
} catch(err) {
  res.send({ statusL500, err })
}
});

module.exports = router;
