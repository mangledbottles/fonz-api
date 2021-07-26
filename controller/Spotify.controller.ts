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
function initSpotify() {
  return new Promise(async (resolve, reject) => {
    try {
      // const lastUpdated = new Date(globalThis.Spotify.lastUpdated);
      const expirationDate = new Date(globalThis.Spotify.lastUpdated);
      expirationDate.setSeconds(expirationDate.getSeconds() + 3600);

      spotifyApi.setAccessToken(globalThis.Spotify.accessToken);
      spotifyApi.setRefreshToken(globalThis.Spotify.refreshToken);

      if (expirationDate < new Date()) {
        await refreshAccessToken();
      }
      resolve({});
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

function refreshAccessToken() {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await connect();
      const repo = connection.getRepository(MusicProviders);

      const { providerId } = globalThis.Spotify;
      const spotify = await repo.findOne({ where: { providerId } })

      spotifyApi.refreshAccessToken().then(async (data) => {
        const { access_token: accessToken } = data.body;

        /** Update Access Token and Sync with Database */
        spotify.accessToken = accessToken;
        await repo.save(spotify);

        spotifyApi.setAccessToken(accessToken);
        resolve({ message: "Token Refreshed" });
      })
    } catch (error) {
      console.error(error)
      reject(error)
    }
  });
}

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

/**
 * Spotify Search for song
 *
 * @param {string} term Name of song searching for.
 * @param {int} limit Optional limit the amount of results.
 * @param {int} offset Optional set an offset for pagination
 * @returns {Promise} returns either resolve or reject with data about song query.
 */
exports.searchSong = (term) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initSpotify();
      const songResults = await spotifyApi.searchTracks(`${term}`);
      resolve(songResults);
    } catch (error) {
      reject(error);
    }

  })
}

exports.getCurrent = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await initSpotify();
      const { body: currentSong } = await spotifyApi.getMyCurrentPlaybackState();
      if (!currentSong) resolve({
        status: 402,
        message: "No songs playing at the moment",
        isQueueEmpty: true
      });


      const isPlaying = currentSong.is_playing;
      const deviceName = currentSong?.device?.name;
      const deviceId = currentSong?.device?.id;
      const volume = currentSong.device?.volume_percent;
      const trackName = currentSong.item?.name;
      const artistName = currentSong.item.album.artists[0]?.name;
      const songUri = currentSong.item.uri;
      const images = currentSong.item.album?.images;

      resolve({
        isPlaying,
        deviceName,
        deviceId,
        volume,
        trackName,
        artistName,
        images,
        songUri
      });
    } catch (error) {
      reject(error);
    }
  })
}