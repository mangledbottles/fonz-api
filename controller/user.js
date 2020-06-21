'use strict';
let User = require('../model/user');
const jwt = require('jsonwebtoken');

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
