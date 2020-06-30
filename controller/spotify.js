'use strict';
var SpotifyWebApi = require('spotify-web-api-fonzi');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});
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
    }.catch((err) => {
      reject(err);
    })
  });
}

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

exports.addToQueue = (songUri) => {
  return new Promise((resolve, reject) => {
    spotifyApi.setAccessToken(global.access_token);
    spotifyApi.setRefreshToken(global.refresh_token);
    spotifyApi.addToQueue(songUri).then((data) => {
      resolve(data.body);
    }).catch((err) => {
      reject(err);
    })
  })
}
