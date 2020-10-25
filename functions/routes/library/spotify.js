var express = require('express');
var router = express.Router();
const Library = require('../../controller/library');
const Spotify = require('../../controller/spotify');

router.post('/refresh', (req, res, next) => {
    Spotify.refreshAccessToken().then((resp) => {
        res.json({
            message: "Token refreshed"
        })
    }).catch((error) => {
        res.status(error.status || 500).send(error);
    })
})

/** Spotify search for song */
router.get('/search', (req, res, next) => {
    const {
        term,
        limit,
        offset
    } = req.query;
    if (!term) return res.status(400).json({
        status: 400,
        message: "Missing parameters.",
        requiredParams: ['term']
    });
    Spotify.searchSong(term).then((resp) => {
        res.status(200).json(resp);
    }).catch((err) => {
        res.status(500).json({
            err
        });
    })
});

/** Spotify get currently playing song */
router.get('/state', function (req, res, next) {
    Spotify.getCurrent().then((currentlyPlayingInfo) => {
        res.status(200).json(currentlyPlayingInfo);
    }).catch((err) => {
        res.status(err.status).json(err);
    });
});

/** Spotify update state */
router.put('/state/:state', (req, res, next) => {
    const {
        state
    } = req.params;
    const {
        device_id
    } = req.query;
    if (!state || !device_id) return res.status(400).json({
        status: 400,
        message: "Missing parameters.",
        requiredParams: ['state', 'device_id']
    });
    if (res.locals.user.type == 'user') return res.status(403).json({
        status: 403,
        message: "Forbidden. Only host accounts have the privilege to use this request. "
    });
    Spotify.setState(state, device_id).then((resp) => {
        res.status(200).json(resp);
    }).catch((err) => {
        res.status(err.status).json(err);
    })
});

/** Spotify get devices */
router.get('/devices', (req, res, next) => {
    if (res.locals.user.type == 'user') return res.status(403).json({
        status: 403,
        message: "Forbidden. Only host accounts have the privilege to use this request. "
    });
    Spotify.getDevices().then((devices) => {
        res.status(200).json({
            status: 200,
            amount: devices.length,
            devices
        });
    }).catch((err) => {
        res.status(500).json({
            err
        });
    })
});

/** Spotify add song to queue */
router.post('/queue/:songUri', (req, res, next) => {
    const {
        songUri
    } = req.params;
    const {
        device_id
    } = req.query;
    if (songUri.split(':')[1] != 'track') return res.status(400).json({
        status: 400,
        message: "An invalid track has been provided. Must be informat of 'spotify:track:TRACKID'. "
    });
    if (!songUri || !device_id) return res.status(400).json({
        status: 400,
        message: "Missing parameters.",
        requiredParams: ['songUri', 'device_id']
    });

    Spotify.addToQueue(songUri, device_id).then((resp) => {
        res.status(200).json((resp.length == 0 || resp.length == undefined) ? {
            status: 200,
            message: "Song queued."
        } : resp);
    }).catch((err) => {
        res.status(err.status).json(err);
    })
});

/** Helpers for wrong URL */
router.get('/queue', (req, res, next) => {
    res.status(400).json({
        status: 400,
        message: "Parameter songUri not supplied. Eg /spotify/queue/spotify:track:xxxxxxxxxxxx"
    });
})

module.exports = router;