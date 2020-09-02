var express = require('express');
var router = express.Router();
const User = require('../controller/user');
const Spotify = require('../controller/spotify');

router.get('/spotify', (req, res) => {
  const {
    code,
    state
  } = req.query,
  storedStateUserId = req.cookies ? req.cookies[process.env.SPOTIFY_STATE_KEY] : null;

  if (state === null || state !== storedStateUserId) return res.status(400).json({
    message: "Error: State mismatch."
  });
  res.clearCookie(process.env.SPOTIFY_STATE_KEY);

  try {
    Spotify.authorizeUser(code).then(async ({
      email,
      display_name,
      product,
      country,
      spotifyId,
      expires_in,
      access_token,
      refresh_token
    }) => {

      // Verify that the spotify account trying to be
      // added isnt already on the Fonz users account
      const spotifyAuthExists = await global.db
        .collection('spotify')
        // .where('spotifyId', '==', spotifyId)
        .where('userId', '==', storedStateUserId)
        .get();

      if(!spotifyAuthExists.empty) {
        // return res.status(403).json({ status: 403, message: "This music provider is already added on your Fonz Account." });
        return res.status(403).json({ status: 403, message: "You can only have 1 Spotify account linked to your Fonz account. "})
      }

      global.db.collection('spotify').add({
        email,
        display_name,
        product,
        country,
        spotifyId,
        expires_in,
        access_token,
        refresh_token,
        userId: storedStateUserId
      }).then((result) => {
        console.log(result);
        res.json({
          status: 200,
          message: "Successfully added to account."
        })
      })
    }).catch((details) => {
      res.send({
        status: 500,
        message: "An internal error has occurred.",
        details,
        location: "Spotify Authorize User"
      });
    });
  } catch (err) {
    res.send({
      statusL500,
      err
    })
  }
});

module.exports = router;