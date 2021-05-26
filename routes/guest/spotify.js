var express = require('express');
var router = express.Router();
const Spotify = require('../../controller/spotify');

var SpotifyWebApi = require('spotify-web-api-fonzi');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

router.use(async (req, res, next) => {
    try {
        // if (global.session.provider !== 'Spotify') return res.status(401).json({
        //     status: 401,
        //     message: 'This session is not linked to a Spotify stream.'
        // })
        console.log({
            session: global.session,
            authId: global.session.authenticationId
        })
        if (!global.session.authenticationId) {
            res.status(401).json({
                message: "No Music Provider linked to Host Fonz Account."
            })
        }
        const spotifyAuth = await global.Providers
            .doc(global.session.authenticationId)
            .get();

        if (!spotifyAuth.exists) return res.status(403).json({
            status: 403,
            message: 'This session has been misconfigured.',
            additionalInfo: 'The provided music provider ID does not exist'
        });

        const {
            access_token,
            refresh_token,
            lastUpdated,
            provider
        } = spotifyAuth.data();

        if(provider != 'Spotify') return res.status(401).json({
            status: 401,
            message: "This session does not have Spotify linked to it."
        })
        console.log({
            access_token, refresh_token, lastUpdated
        })

        global.access_token = access_token;
        global.refresh_token = refresh_token;
        global.lastUpdated = lastUpdated;
        next();
    } catch (error) {
        throw (error)
    }
});

// exports.refreshAccessToken = () => {
//     return new Promise(async (resolve, reject) => {
//         try {


//             spotifyApi.refreshAccessToken().then((data) => {
//                 global.SpotifyDB
//                     .collection('authentication')
//                     .doc(global.session.sessionId)
//                     .update({
//                         access_token: global.access_token,
//                         lastUpdated: global.admin.firestore.FieldValue.serverTimestamp()
//                     });
//                 resolve();
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// }


router.get('/search', (req, res, next) => {
    try {
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
        // console.log({
        //     access_token: global.access_token,
        //     refresh_token: global.refresh_token
        // })
        Spotify.searchSong(term).then((resp) => {
            res.status(200).json(resp);
        }).catch((err) => {
            res.status(500).json({
                err
            });
        })
    } catch (error) {
        res.status(500).send(error)
    }
});

/** Spotify get currently playing song */
router.get('/state', function (req, res, next) {
    Spotify.getCurrent().then((currentlyPlayingInfo) => {
        res.status(200).json(currentlyPlayingInfo);
    }).catch((err) => {
        res.status(err.status).json(err);
    });
});

/** Spotify add song to queue */
router.post('/queue/:songUri', (req, res, next) => {
    console.log("TRY TO QUEUE SONG")
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
    if (!songUri) return res.status(400).json({
        status: 400,
        message: "Missing parameters.",
        requiredParams: ['songUri', 'device_id']
    });

    Spotify.addToQueue(songUri).then((resp) => {
        return res.status(200).json((resp.length == 0 || resp.length == undefined) ? {
            status: 200,
            message: "Song queued."
        } : resp);
    }).catch((err) => {
        res.status(err.status).json(err);
    })
});

router.all('*', (req, res, next) => {
    res.status(400).json({
        status: 400,
        message: 'Invalid endpoint or method used for Spotify Guest'
    })
})

module.exports = router;