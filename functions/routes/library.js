var express = require('express');
var router = express.Router();

const SpotifyRoutes = require('./library/spotify');
// const Library = require('../controller/library');
// const Spotify = require('../controller/spotify');

// router.use()

// router.get('/spotify', (req, res, next) => {
//   // res.status(200).json({ status: 200, message: "Spotify Library API "});
// });

async function UserHasSpotifyAccount(req, res, next) {
  const spotifyAuthExists = await global.db
    .collection('spotify')
    .where('userId', '==', global.userId)
    .limit(1)
    .get();

  if (spotifyAuthExists.empty) {
    return res.status(401).json({
      status: 401,
      message: "This Fonz account does not have a Spotify account linked to it."
    });
  }

  // console.log({ spotifyAuthExists })
  spotifyAuthExists.forEach((doc) => {
    const { access_token, refresh_token } = doc.data();
    global.access_token = access_token;
    global.refresh_token = refresh_token;
    // console.log(doc.id, '=>', doc.data())
  })

  next();
};

router.use('/spotify', UserHasSpotifyAccount, SpotifyRoutes);

// /** Spotify search for song */
// router.get('/spotify/search', (req, res, next) => {
//   const { term, limit, offset } = req.query;
//   if(!term) return res.status(400).json({ status: 400, message: "Missing parameters.", requiredParams: ['term'] });
//   Spotify.searchSong(term).then((resp) => {
//     res.status(200).json(resp);
//   }).catch((err) => {
//     res.status(500).json({ err });
//   })
// });

// /** Spotify get currently playing song */
// router.get('/spotify/state', function(req, res, next) {
//   Spotify.getCurrent().then((currentlyPlayingInfo) => {
//     res.status(200).json(currentlyPlayingInfo);
//   }).catch((err) => {
//     res.status(err.status).json(err);
//   });
// });

// /** Spotify update state */
// router.put('/spotify/state/:state', (req, res, next) => {
//   const { state } = req.params;
//   const { device_id } = req.query;
//   if(!state || !device_id) return res.status(400).json({ status: 400, message: "Missing parameters.", requiredParams: ['state', 'device_id'] });
//   if(res.locals.user.type == 'user') return res.status(403).json({ status: 403, message: "Forbidden. Only host accounts have the privilege to use this request. "});
//   Spotify.setState(state, device_id).then((resp) => {
//     res.status(200).json(resp);
//   }).catch((err) => {
//     res.status(err.status).json(err);
//   })
// });

// /** Spotify get devices */
// router.get('/spotify/devices', (req, res, next) => {
//   if(res.locals.user.type == 'user') return res.status(403).json({ status: 403, message: "Forbidden. Only host accounts have the privilege to use this request. "});
//   Spotify.getDevices().then((devices) => {
//     res.status(200).json({ status: 200, amount: devices.length, devices });
//   }).catch((err) => {
//     res.status(500).json({ err });
//   })
// });

// /** Spotify add song to queue */
// router.get('/spotify/queue/:songUri', (req, res, next) => {
//   const { songUri } = req.params;
//   const { device_id } = req.query;
//   if(songUri.split(':')[1] != 'track') return res.status(400).json({ status: 400, message: "An invalid track has been provided. Must be informat of 'spotify:track:TRACKID'. " });
//   if(!songUri || !device_id) return res.status(400).json({ status: 400, message: "Missing parameters.", requiredParams: ['songUri', 'device_id'] });

//   Spotify.addToQueue(songUri, device_id).then((resp) => {
//     res.status(200).json((resp.length == 0 || resp.length == undefined) ? { status: 200, message: "Song queued."} : resp );
//   }).catch((err) => {
//     res.status(err.status).json(err);
//   })
// });


// /** Helpers for wrong URL */
// router.get('/spotify/queue', (req, res, next) => {
//   res.status(400).json({ status: 400, message: "Parameter songUri not supplied. Eg /spotify/queue/spotify:track:xxxxxxxxxxxx"});
// })

module.exports = router;