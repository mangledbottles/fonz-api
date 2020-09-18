'use strict';
let User = require('../model/user');
const jwt = require('jsonwebtoken');
var SpotifyWebApi = require('spotify-web-api-fonzi');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

function generateId(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}

exports.createSession = () => {
  return new Promise(async (resolve, reject) => {
    const sessionAlreadyExists = await global.SessionsDB
      .where('userId', '==', global.userId)
      .get();
    if (!sessionAlreadyExists.empty) return reject({
      status: 403,
      message: 'User already has an active session'
    });

    const session = await global.SessionsDB.add({
      provider: 'Spotify', // hard coded for the moment
      userId: global.userId,
      active: true,
      createdAt: global.admin.firestore.FieldValue.serverTimestamp()
    });
    resolve({
      status: 201,
      message: `Session ${session.id} has been created`,
      sessionId: session.id
    });
  });
}

exports.getSession = () => {
  return new Promise(async (resolve, reject) => {
    const sessionInformation = await global.SessionsDB
      .where('userId', '==', global.userId)
      .limit(1)
      .get();
    if (sessionInformation.empty) return reject({
      status: 404,
      message: 'No sessions active'
    });
    sessionInformation.forEach((doc) => {
      const sessionId = doc.id;
      console.log({ sessionId })
      const { createdAt, active, provider } = doc.data();
      resolve({ sessionId, createdAt, provider, active })
    })
  })
}

exports.deleteSession = (sessionId) => {
  return new Promise(async (resolve, reject) => {
    const sessionInformation = await global.SessionsDB
      .doc(sessionId)
      .get();
    if (!sessionInformation.exists) return reject({
      status: 404,
      message: `Session ${sessionId} does not exist`
    });
    const { userId } = sessionInformation.data();
    if(userId !== global.userId) return reject({
      status: 403,
      message: 'This session ID is not linked to the given user account'
    })
    const res = await global.SessionsDB
      .doc(sessionId)
      .delete();

    resolve()
  });
}

exports.updateSession = (sessionId, active) => {
  return new Promise(async (resolve, reject) => {
    const sessionInformation = await global.SessionsDB
      .doc(sessionId)
      .get();
    if (!sessionInformation.exists) return reject({
      status: 404,
      message: `Session ${sessionId} does not exist`
    });
    const { userId } = sessionInformation.data();
    if(userId !== global.userId) return reject({
      status: 403,
      message: 'This session ID is not linked to the given user account'
    })

    const res = await global.SessionsDB
    .doc(sessionId)
    .update({
      active
    });

    resolve({ status: 200, message: 'Session has been updated' })
  });
}

exports.generateJWT = (service, email, access_token, refresh_token, spotifyId, product, display_name) => {
  return new Promise((resolve, reject) => {
    const sid = spotifyId + generateId(10);
    User.creatAuthentication((err, res) => {
      const payload = {
        sid,
        email,
        service,
        display_name,
        type: 'host'
      }
      jwt.sign(payload, process.env.JWT_PRIVATE_KEY, (err, token) => {
        if (err) reject(err);
        resolve({
          token,
          sid
        });
      });
    }, service, email, access_token, refresh_token, sid, spotifyId, product);
  });
}

exports.generateUserJWT = (service, sid) => {
  return new Promise((resolve, reject) => {
    const payload = {
      sid,
      service,
      type: 'user'
    }
    jwt.sign(payload, process.env.JWT_PRIVATE_KEY, (err, token) => {
      if (err) return reject(err);
      resolve({
        token,
        sid
      });
    })
  });
}

exports.isValidSession = ({
  sid,
  service
}) => {
  return new Promise((resolve, reject) => {
    User.isValidSession((err, isValidSession, access_token, refresh_token) => {
      if (err) return reject(err);
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);
      spotifyApi.refreshAccessToken().then((newToken) => {
        let access_token = newToken.body['access_token'];
        global.access_token = access_token;
        global.refresh_token = refresh_token;
        resolve(isValidSession);
      }).catch((err) => {
        reject({
          err,
          location: "RefreshToken",
          message: "Spotify would not generate access token."
        });
      })
    }, sid, service);
  });
}

exports.getSpotifyAccessAndRefreshToken = (userId) => {
  return new Promise(async (resolve, reject) => {
    const tokens = await global.SpotifyDB.collection('authentication')
      .where('userId', '==', global.userId)
      .limit(1)
      .get();
    if (tokens.empty) return reject({
      status: 404,
      message: "There is no Spotify account linked to this Fonz Account"
    })
    tokens.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      resolve(doc.data())
    });
  });
}

exports.userIsSessionActive = (sid) => {
  return new Promise((resolve, reject) => {
    User.getSessionInformation((err, sessionInformation) => {
      if (err) return reject(err);
      resolve(sessionInformation)
      // resolve({ activeSession: sessionInformation.active==1, sessionInformation});
    }, sid)
  });
}