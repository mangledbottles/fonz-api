var express = require('express');
var router = express.Router();
const Spotify = require('../../controller/spotify');

router.use(async (req, res, next) => {
    if(global.session.provider !== 'Spotify') return res.status(401).json({
        status: 401,
        message: 'This session is not linked to a Spotify stream.'
    })
    const spotifyAuth = await global.SpotifyDB
    .collection('authentication')
    .doc(global.session.authenticationId)
    .get();

    if(!spotifyAuth.exists) return res.status(403).json({
        status: 403,
        message: 'This session has been misconfigured.'
    });

    const { access_token, refresh_token, lastUpdated } = spotifyAuth.data();
    global.access_token = access_token;
    global.refresh_token = refresh_token;
    global.lastUpdated = lastUpdated;

    next();
});

router.get('/', (req, res, next) => {
    res.send("ALL G")
});

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
    console.log({ access_token: global.access_token, refresh_token: global.refresh_token })
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

module.exports = router;