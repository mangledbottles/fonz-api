var express = require('express');
var router = express.Router();
const Library = require('../controller/library');
const Spotify = require('../controller/spotify');

router.get('/spotify/search', (req, res, next) => {
  const { term, limit, offset } = req.query;
  if(!term) return res.status(400).json({ status: 400, message: "Missing parameters.", requiredParams: ['term'] });
  Spotify.searchSong(term).then((resp) => {
    res.status(200).json(resp);
  }).catch((err) => {
    res.status(500).json({ err });
  })
})

router.get('/spotify/queue/:songUri', (req, res, next) => {
  const { songUri } = req.params;
  if(songUri.split(':')[1] != 'track') return res.status(400).json({ status: 400, message: "An invalid track has been provided. Must be informat of 'spotify:track:TRACKID'. " });
  if(!songUri) return res.status(400).json({ status: 400, message: "Missing parameters.", requiredParams: ['songUri'] });
  Spotify.addToQueue(songUri).then((resp) => {
    res.status(200).json((resp.length == 0 || resp.length == undefined) ? { status: 200, message: "Song queued."} : resp );
  }).catch((err) => {
    res.status(500).json({ err });
  })
});

module.exports = router;
