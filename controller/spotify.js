'use strict';
var SpotifyWebApi = require('spotify-web-api-fonzi');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});
var _ = require('lodash');

exports.authorizeUser = (code) => {
  return new Promise((resolve, reject) => {
    spotifyApi.authorizationCodeGrant(code).then((authData) => {
      const { expires_in, access_token, refresh_token } = authData.body;
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
      spotifyApi.getMe().then((userInfo) => {
        console.log(userInfo)
        const spotifyId = userInfo.body.id;
        const { email, display_name, product, country} = userInfo.body;
        resolve( { email, display_name, product, country, spotifyId, expires_in, access_token, refresh_token } );
      }).catch((err) => {
        reject(err)
      });
    }).catch((err) => {
        reject(err);
    });
  });
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
  return new Promise((resolve, reject) => {
    spotifyApi.setAccessToken(global.access_token);
    spotifyApi.setRefreshToken(global.refresh_token);
    spotifyApi.searchTracks(`track:${term}`).then((data) => {
      resolve(data.body);
    }).catch((err) => {
      reject(err);
    })
  })
}

exports.getCurrent = async () => {
  return new Promise((resolve, reject) => {
    spotifyApi.setAccessToken(global.access_token);
    spotifyApi.setRefreshToken(global.refresh_token);
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if(_.isEmpty(data.body)) resolve({ status: 402, message: "No songs playing at the moment. ", isQueueEmpty: true });

      const currentSong   = data.body;
      const is_playing    = currentSong.is_playing;
      const deviceName    = currentSong.device.name;
      const deviceId      = currentSong.device.id;
      const volume        = currentSong.device.volume_percent;
      const trackName     = currentSong.item.name;
      const artistName    = currentSong.item.album.artists[0].name;
      const images        = currentSong.item.album.images;

      resolve({ is_playing, deviceName, deviceId, volume, trackName, artistName, images });
    }).catch((err) => {
      reject({ status: 500, err });
    })
  })
}

exports.setState = (state, device_id) => {
  return new Promise(async (resolve, reject) => {
    spotifyApi.setAccessToken(global.access_token);
    spotifyApi.setRefreshToken(global.refresh_token);

    const currentSong = await this.getCurrent();
    if(currentSong.isQueueEmpty) return reject({ status: 410, message: "No music playing at the moment."});
    const { is_playing, deviceName, trackName } = currentSong;

    switch(state) {
      case 'play':
        if(is_playing) reject({ status: 403, message: `Track '${trackName}' is already playing on device ${deviceName}.`, isPlaying: true })
        spotifyApi.play({ device_id }).then((resp) => {
          const message = (_.isEmpty(resp.body)) ? `Track '${trackName}' is now playing on device ${deviceName}.` : "Song could not be played";
          resolve({ status: 200, message, isPlaying: true });
        }).catch((err) => {
          reject({ status: 400, err, location: 'Spotify Play Controller' });
        });
        break;

      case 'pause':
        if(!is_playing) reject({ status: 403, message: `Track '${trackName}' is already paused on device ${deviceName}.`, isPlaying: false })
        spotifyApi.pause({ device_id }).then((resp) => {
          const message = (_.isEmpty(resp.body)) ? `Track '${trackName}' is now paused on device ${deviceName}.` : "Song could not be paused.";
          resolve({ status: 200, message, isPlaying: false });
        }).catch((err) => {
          reject({ status: 400, err });
        });
        break;

      default:
        reject({ status: 400, message: "Invalid state provided. PUT /state/{state} where state = {pause|play}" });
        break;
    }
  });
}

exports.getDevices = () => {
  return new Promise((resolve, reject) => {
    spotifyApi.setAccessToken(global.access_token);
    spotifyApi.setRefreshToken(global.refresh_token);
    spotifyApi.getMyDevices().then((devices) => {
      resolve(devices.body.devices);
    }).catch((err) => {
      reject(err);
    })
  })
}

exports.addToQueue = (songUri, device_id) => {
  return new Promise(async (resolve, reject) => {
    spotifyApi.setAccessToken(global.access_token);
    spotifyApi.setRefreshToken(global.refresh_token);

    // const currentSong = await this.getCurrent();
    this.getCurrent().then((currentSong) => {
      console.log(currentSong)
      if(currentSong.isQueueEmpty) {
        spotifyApi.play({ uris: [ songUri ], device_id }).then((data) => {
          resolve(data)
        }).catch((err) => {
          reject({ status: 500, err });
        })
      } else {
        spotifyApi.addToQueue(songUri, device_id).then((data) => {
          resolve(data.body);
        }).catch((err) => {
          reject({ status: 404, err });
        })
      }
    }).catch((err) => {
      reject({ status: 404, message: "No active devices open with Spotify", viewActiveDevices: "GET /library/spotify/devices", err});
    });
  });
}
