import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

const NAMESPACE = 'Callback';

/** Import dependecies */
const Spotify = require('../controller/Spotify.controller');
 

router.get('/spotify', async (req: Request, res: Response) => {
    try {
        globalThis.Logger.log('info', `[${NAMESPACE}] Authenticating from Spotify `, { ...globalThis.LoggingParams})

        const { code, state } = req.query;
        const [userId, device] = state.toString().split("+");
        const { email, display_name, product, country, spotifyId,
            expires_in, access_token, refresh_token } = await Spotify.authorizeUser(code);

        await Spotify.storeSpotifyCredentials({
            email, display_name, product, country, spotifyId,
            expires_in, access_token, refresh_token
        }, userId);
        const { isDuplicate, providerId } = await Spotify.checkIfSpotifyAccountDuplicate(userId, spotifyId);

        /** Requirement for Hosts only
        if(product != "premium") res.status().json({
            message: "Spotify Premium is required to stream music."
        }) */

        if (device == 'iOS') {
            res.redirect("fonz-music://spotify")
        } else if (device == 'Android') {
            res.redirect("https://fonzmusic.com/spotify");
        } else {
            res.status(400).send({ message: "Invalid device"});
        }
    } catch (error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Authenticate from Spotify `, { ...globalThis.LoggingParams, error },)
    
        res.status(error.status || 500).send(error);
    }
});

module.exports = router;