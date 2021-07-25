'use strict';

/* Import database configuration */
import { connect } from '../config/config';

/* Import entities */
import { MusicProviders } from "../entity/MusicProviders";

/** Import controllers */
// const Session = require('../controller/Sessions.controller');

var SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// function initSpotify() {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // if (globalThis.Spotify.lastUpdated == undefined) {
//       //   const provider = await Session.getProvider(globalThis._sessionId);
//       // //   globalThis.Spotify.provider 
//       //   globalThis.Spotify.lastUpdated = provider.lastUpdated;
//       // }

//       spotifyApi.setAccessToken(globalThis.Spotify.access_token);
//       spotifyApi.setRefreshToken(globalThis.Spotify.refresh_token);

//       // if (((globalThis.lastUpdated + 3600) * 1000) >= parseInt(+new Date()) / 1000) {
//       //   console.log("Spotify Token being refreshed")
//       //   const updateRef = await refreshAccessToken();
//       // }

//       resolve({});
//     } catch (error) {
//       console.error(error);
//       reject(error);
//     }
//   });
// }

exports.authorizeUser = (code) => {
  return new Promise(async (resolve, reject) => {
    try {

      const authData = await spotifyApi.authorizationCodeGrant(code);
      const { expires_in, access_token, refresh_token } = authData.body;

      if (!expires_in || !access_token || !refresh_token) return reject("Spotify Error. Spotify could not generate user access_token and refresh_token. Try again later.");

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      const userInfo = await spotifyApi.getMe();
      const spotifyId = userInfo.body.id;
      const { email, display_name, product, country } = userInfo.body;
      resolve({
        email,
        display_name,
        product,
        country,
        spotifyId,
        expires_in,
        access_token,
        refresh_token
      });
    } catch (err) {
      reject(err);
    }
  });
}

exports.storeSpotifyCredentials = ({ email, display_name, product, country, spotifyId,
  expires_in, access_token, refresh_token }, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await connect();
      const repo = connection.getRepository(MusicProviders);

      const additional = JSON.stringify({ product, country, spotifyId, email, display_name });
      repo.save({ userId, country, expiresIn: expires_in, accessToken: access_token, refreshToken: refresh_token, additional, displayName: display_name })

      resolve({})
    } catch (error) {
      console.error(error);
      reject(error);
    }
  })
}