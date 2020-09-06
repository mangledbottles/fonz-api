var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-fonzi');
const Host = require("../controller/host");
const spotifyApi = new SpotifyWebApi();


router.get('/', (req, res, next) => {
  Host.getSpotifyAccessAndRefreshToken('1').then((tokens) => {
    res.json(tokens)
  }).catch((error) => {
    res.status(error.status || 500).json(error);
  })
  // res.send("AUTHENTICATED");
})

router.get('/spotify', function (req, res, next) {
  // if(res.locals.user.type == 'user') return res.status(403).json({ status: 403, message: "Forbidden. Only host accounts have the privilege to use this request. "});
  spotifyApi.setAccessToken(global.access_token);
  spotifyApi.getMe().then((data) => {
    res.json({
      sid: res.locals.user.sid,
      userInformation: data.body
    })
  }).catch((err) => {
    res.status(500).json({
      err
    })
  });
});


/* Sessions */

// Create session
router.post('/session', async (req, res, next) => {
  Host.createSession().then((sessionInfo) => {
    res.status(sessionInfo.status || 200).json(sessionInfo);
  }).catch((err) => {
    res.status(err.status || 500).json(err);
  })
});

// Get session information
router.get('/session/', (req, res, next) => {
  Host.getSession().then((sessionInfo) => {
    res.status(sessionInfo.status || 200).json(sessionInfo);
  }).catch((err) => {
    res.status(err.status || 500).json(err);
  })
});

// Delete session
router.delete('/session/:sessionId', (req, res, next) => {
  const {
    sessionId
  } = req.params;
  // if(!sessionId) return res.status(400).json({ message: "Session ID missing"})
  Host.deleteSession(sessionId).then(() => {
    res.status(204).json({})
  }).catch((error) => {
    res.status(error.status || 500).json(error);
  })
});

// Update session
router.put('/session/:sessionId', (req, res, next) => {
  const {
    sessionId
  } = req.params;
  const {
    active
  } = req.body;
  if (!active) return res.status(400).json({
    status: 400,
    message: 'Missing parameter active'
  });
  if (!(active == 'true' || active == 'false')) return res.status(403).json({
    message: "Invalid input"
  })
  Host.updateSession(sessionId, active).then((resp) => {
    res.status(resp.status || 200).json(resp);
  }).catch((err) => {
    res.status(err.status || 500).json(err);
  })
})


module.exports = router;