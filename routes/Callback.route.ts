import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import dependecies */
const Spotify = require('../controller/Spotify.controller');
 

router.get('/spotify', async (req: Request, res: Response) => {
    try {
        const { code, state } = req.query;
        
        const { email, display_name, product, country, spotifyId, 
            expires_in, access_token, refresh_token } = await Spotify.authorizeUser(code);
        
        await Spotify.storeSpotifyCredentials({ email, display_name, product, country, spotifyId, 
            expires_in, access_token, refresh_token }, state);

        /** Requirement for Hosts only
        if(product != "premium") res.status().json({
            message: "Spotify Premium is required to stream music."
        }) */

       // TODO: Android Redirect
        res.redirect("fonz-music://spotify")
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send(error);
    }
});

module.exports = router;