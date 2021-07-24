import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import dependecies */
const Spotify = require('../controller/Spotify.controller');
 

router.get('/spotify', async (req: Request, res: Response) => {
    try {
        const { code, state } = req.query,
            storedStateUserId = req.cookies ? req.cookies[process.env.SPOTIFY_STATE_KEY] : null;
        if (storedStateUserId == null) res.status(400).json({
            message: "Error: State mismatch."
        });
        console.log(storedStateUserId)
        
        res.clearCookie(process.env.SPOTIFY_STATE_KEY);

        const { email, display_name, product, country, spotifyId, 
            expires_in, access_token, refresh_token } = await Spotify.authorizeUser(code);
        
        await Spotify.storeSpotifyCredentials({ email, display_name, product, country, spotifyId, 
            expires_in, access_token, refresh_token }, state);

        /** Requirement for Hosts only
        if(product != "premium") res.status().json({
            message: "Spotify Premium is required to stream music."
        })
        */
        res.send({ message: "Successfully added Spotify to your account."})
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send(error);
    }
});

module.exports = router;