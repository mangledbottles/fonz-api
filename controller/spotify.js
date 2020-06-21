'use strict';
// var querystring = require('querystring');
// var request = require('request'); // "Request" library
var SpotifyWebApi = require('spotify-web-api-node');
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
        // console.log({ spotifyId })
        resolve( { email, display_name, product, country, spotifyId, expires_in, access_token, refresh_token } );
      }).catch((err) => {
        reject(err)
      });
    });
  });
}
