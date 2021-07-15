var express = require('express');
var router = express.Router();
const User = require('../controller/host');
const Spotify = require('../controller/spotify');

/** Middleware function to verify valid JWT and that the session ID associated with JWT is active and valid **/
function authChecker(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({
    status: 401,
    message: "Authentication token missing"
  });
  const token = authHeader.split(' ')[1],
    payload = jwt.decode(token);

  admin.auth().verifyIdToken(token)
    .then((user) => {
      res.locals.user = user;
      global.userId = user.user_id;
      next()
    }).catch((error) => {
      return res.status(403).json({
        status: 403,
        message: "Invalid access token has been provided",
        error
      })
    });
}

// function authChecker(req, res, next) {
//   global.userId = "aHfMl3lUHWaCqBsFgQLzWw5DAcE3";
//   next()
// }

router.get('/spotify', (req, res) => {
  const {
    code,
    state
  } = req.query,
    storedStateUserId = req.cookies ? req.cookies[process.env.SPOTIFY_STATE_KEY] : null;
  if (storedStateUserId == null) return res.status(400).json({
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
      const spotifyAuthExists = await global.Providers
        .where('provider', '==', 'Spotify')
        .where('userId', '==', storedStateUserId)
        .get();

      console.log("Set userID for callback: ", storedStateUserId)

      if (!spotifyAuthExists.empty) {
        return res.status(403).json({ status: 403, message: "You can only have 1 Spotify account linked to your Fonz account. " })
      }

      global.Providers.add({
        email,
        display_name,
        product,
        country,
        spotifyId,
        expires_in,
        access_token,
        refresh_token,
        userId: storedStateUserId,
        lastUpdated: global.admin.firestore.FieldValue.serverTimestamp(),
        provider: "Spotify"
      }).then((result) => {
        console.log(result);
        res.json({
          status: 200,
          message: "Successfully added to account."
        })
      })
    }).catch((details) => {
      console.error(details)
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

router.get('/v2/spotify', authChecker, (req, res) => {
  const { code } = req.query;

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

      console.log({
        email,
        display_name,
        product,
        country,
        spotifyId,
        expires_in,
        access_token,
        refresh_token
      })
      // Verify that the spotify account trying to be
      // added isnt already on the Fonz users account
      const spotifyAuthExists = await global.Providers
        .where('provider', '==', 'Spotify')
        .where('userId', '==', global.userId)
        .get();

      console.log("Set userID for callback: ", global.userId)

      if (!spotifyAuthExists.empty) {
        return res.status(403).json({ status: 403, message: "You can only have 1 Spotify account linked to your Fonz account. " })
      }

      global.Providers.add({
        email,
        display_name,
        product,
        country,
        spotifyId,
        expires_in,
        access_token,
        refresh_token,
        userId: global.userId,
        lastUpdated: global.admin.firestore.FieldValue.serverTimestamp(),
        provider: "Spotify"
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