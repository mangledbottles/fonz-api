'use strict';

/* Import database configuration */
import { connect } from '../config/config';

/* Import entities */
import { MusicProviders } from "../entity/MusicProviders";

/** Import controllers */
// const Session = require('../controller/Sessions.controller');

const SpotifyWebApi = require('spotify-web-api-node');
const _ = require("lodash");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

function initSpotify() {
  return new Promise(async (resolve, reject) => {
    try {
      // const lastUpdated = new Date(globalThis.Spotify.lastUpdated);
      const expirationDate = new Date(globalThis.Spotify.lastUpdated);
      expirationDate.setSeconds(expirationDate.getSeconds() + 3600);
      // expirationDate.setSeconds(expirationDate.getSeconds());

      spotifyApi.setAccessToken(globalThis.Spotify.accessToken);
      spotifyApi.setRefreshToken(globalThis.Spotify.refreshToken);
      await refreshAccessToken();

      // if (expirationDate <= new Date() || !globalThis.Spotify.accessToken) {
      //   console.log("Refreshing token")
      //   await refreshAccessToken();
      // } else {
      //   console.log("Token is good: [" + expirationDate + "], vs, [" + new Date() + "]");
      // }
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

        console.log(`Got new access token ${accessToken}`);

        /** Update Access Token and Sync with Database */
        globalThis.Spotify.accessToken = accessToken;
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

      const additional = { product, country, spotifyId, email, display_name };
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
exports.searchSong = (term, offset = 0) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initSpotify();
      const songResults = await spotifyApi.searchTracks(term, { market: 'IE', offset });
      resolve(songResults);
    } catch (error) {
      reject(error);
    }
  })
}

function initGuestSpotify() {
  return new Promise(async (resolve, reject) => {
    try {
      // spotifyApi.resetCredentials();

      const connection = await connect();
      const repo = connection.getRepository(MusicProviders);

      const userId = globalThis.userId; // Guest User Id
      const guestProvider = await repo.findOne({ where: { userId } });

      if (!guestProvider) reject({ status: 404, message: "Guest does not have a Spotify linked" });

      const { lastUpdated, accessToken, refreshToken } = guestProvider;

      globalThis.GuestSpotify = { lastUpdated, accessToken, refreshToken };

      const expirationDate = new Date(lastUpdated);
      expirationDate.setSeconds(expirationDate.getSeconds() + (3600 * 0));

      spotifyApi.setAccessToken(accessToken);
      spotifyApi.setRefreshToken(refreshToken);


      if (expirationDate <= new Date()) {
        spotifyApi.refreshAccessToken().then(async (data) => {
          const { access_token: accessToken } = data.body;

          console.log(`Got new access token ${accessToken}`);

          /** Update Access Token and Sync with Database */
          globalThis.GuestSpotify.accessToken = accessToken;
          guestProvider.accessToken = accessToken;

          await repo.save(guestProvider);
          spotifyApi.setAccessToken(accessToken);

          resolve({ message: "Token Refreshed" });
        })
      } else {
        resolve({});
      }
    } catch (error) {
      reject({ ...error, message: "Guest does not have Spotify linked." });
    }
  })
}


type searchType = 'artists' | 'tracks' | 'playlists';
exports.getGuestTop = (type: searchType, offset = 0, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initGuestSpotify();

      let top;
      switch (type) {
        case 'artists':
          top = await spotifyApi.getMyTopArtists({ limit, offset, time_range: 'medium_term' });
          break;

        case 'tracks':
          top = await spotifyApi.getMyTopTracks({ limit, offset, time_range: 'medium_term' });
          break;

        case 'playlists':
          top = await spotifyApi.getUserPlaylists({ limit, offset });
          break;
      }

      if (!top.body) return reject({ status: 404, message: "This user does not have any top artists" })
      resolve(top.body.items);
    } catch (error) {
      if (_.isEmpty(error.body)) return reject({ status: 404, message: "This user does not have any top artists" })
      reject(error);
    }
  })
};

exports.getTracksByArtistId = (artistId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initSpotify();


      // TODO: make country dynamic based on Session
      const { body: tracks } = await spotifyApi.getArtistTopTracks(artistId, 'IE');
      resolve(tracks.tracks);

    } catch (error) {
      reject(error);
    }
  })
}

exports.getTracksByPlaylistId = (playlistId: string, offset: number, limit: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initSpotify();

      const { body } = await spotifyApi.getPlaylistTracks(playlistId, { offset, limit });
      resolve(body)
    } catch (error) {
      reject(error);
    }
  });
}

exports.getNewReleases = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await initSpotify();
      // TODO: make country dynamic based on Session
      const { body: releases } = await spotifyApi.getNewReleases({ limit: 5, offset: 0, country: 'IE' })
      resolve(releases);
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

      if (!currentSong || _.isEmpty(currentSong)) return reject({
        status: 402,
        message: "No songs playing at the moment",
        isQueueEmpty: true
      });


      const isPlaying = currentSong.is_playing;
      const deviceName = currentSong?.device?.name;
      const deviceId = currentSong?.device?.id;
      const volume = currentSong.device?.volume_percent;
      const trackName = currentSong.item?.name;
      const artistName = currentSong.item?.album?.artists[0]?.name;
      const songUri = currentSong.item?.uri;
      const images = currentSong.item?.album?.images;

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

exports.addToQueue = (songUri, device_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await initSpotify();

      const currentSong = await exports.getCurrent();
      if (currentSong.isQueueEmpty) {
        spotifyApi.play({
          uris: [songUri],
          device_id
        }).then((data) => {
          resolve(data)
        }).catch((err) => {
          reject({
            status: 500,
            // This is a guess that this is the problem
            message: 'Ensure that the host has Spotify open on a device',
            err
          });
        })
      } else {
        spotifyApi.addToQueue(songUri, device_id).then((data) => {
          resolve(data.body);
        }).catch((err) => {
          reject({
            status: 404,
            err
          });
        })
      }
    } catch (error) {
      reject(error);
    }

  });
}
