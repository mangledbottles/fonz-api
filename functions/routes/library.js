var express = require('express');
var router = express.Router();

const SpotifyRoutes = require('./library/spotify');

async function UserHasSpotifyAccount(req, res, next) {
  const spotifyAuthExists = await global.Providers
    .where('provider', '==', 'Spotify')
    .where('userId', '==', global.userId)
    .limit(1)
    .get();

  if (spotifyAuthExists.empty) return res.status(401).json({
      status: 401,
      message: "This Fonz account does not have a Spotify account linked to it."
    });

  spotifyAuthExists.forEach((doc) => {
    const { access_token, refresh_token } = doc.data();
    global.access_token = access_token;
    global.refresh_token = refresh_token;
  })
  next();
};

// Router for Spotify Requests
router.use('/spotify', UserHasSpotifyAccount, SpotifyRoutes);

module.exports = router;