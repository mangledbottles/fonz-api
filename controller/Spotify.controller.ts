'use strict';

/** Import controllers */
const Session = require('../controller/Sessions.controller');

var SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});



function initSpotify() {
    return new Promise(async (resolve, reject) => {
      try {
        // if (globalThis.Spotify.lastUpdated == undefined) {
        //   const provider = await Session.getProvider(globalThis._sessionId);
        // //   globalThis.Spotify.provider 
        //   globalThis.Spotify.lastUpdated = provider.lastUpdated;
        // }
  
        spotifyApi.setAccessToken(globalThis.Spotify.access_token);
        spotifyApi.setRefreshToken(globalThis.Spotify.refresh_token);
  
        // if (((globalThis.lastUpdated + 3600) * 1000) >= parseInt(+new Date()) / 1000) {
        //   console.log("Spotify Token being refreshed")
        //   const updateRef = await refreshAccessToken();
        // }

        resolve({});
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }