'use strict';
let User = require('../model/user');
const jwt = require('jsonwebtoken');
var SpotifyWebApi = require('spotify-web-api-fonzi');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

function generateId(length){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ )
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    return result;
}

exports.generateJWT = (service, email, access_token, refresh_token, spotifyId, product, display_name) => {
  return new Promise((resolve, reject) => {
    const sid = spotifyId + generateId(10);
    User.creatAuthentication((err, res) => {
      const payload = {
         sid, email, service, display_name
      }
      var token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY);
      resolve(token);
    }, service, email, access_token, refresh_token, sid, spotifyId, product);
  });
}

exports.isValidSession = ({ sid, email, service }) => {
  return new Promise((resolve, reject) => {
    User.isValidSession((err, isValidSession, access_token, refresh_token) => {
      if(err) return reject(err);
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
      spotifyApi.refreshAccessToken().then((newToken) => {
      let access_token = newToken.body['access_token'];
      global.access_token = access_token;
      global.refresh_token = refresh_token;
      resolve(isValidSession);
    }).catch((err) => {
      reject(err);
    })}, sid, email, service);
  });
}

exports.getAccessAndRefreshToken = (sid) => {
  return new Promise((resolve, reject) => {
    User.getAccessAndRefreshToken((err, tokens) => {
      if(err) return reject(err);
      resolve(tokens);
    }, sid);
  });
}
