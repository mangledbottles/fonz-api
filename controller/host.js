'use strict';
let User = require('../model/user');
const jwt = require('jsonwebtoken');
var SpotifyWebApi = require('spotify-web-api-node');
const {
  reject
} = require('lodash');
const { provider } = require('firebase-functions/lib/providers/analytics');
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


exports.getProvider = (providerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const spotifyRef = await global.Providers
        .doc(providerId)
        .get();
      if (!spotifyRef.exists) return reject({
        status: 404,
        message: `The provider ${providerId} does not exist.`
      });
      const providerData = spotifyRef.data();
      if (providerData.userId != global.userId) return reject({
        status: 401,
        message: "This provider is not linked to this Fonz account."
      });

      resolve(providerData);
    } catch (error) {
      reject(error);
    }
  })
}

exports.getProviders = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let providers = [];
      // Get Spotify
      // const spotifyRef = await global.SpotifyDB.collection('authentication')
      // .where('userId', '==', global.userId)
      // .limit(1)
      // .get();

      const spotifyRef = await global.Providers
        .where('userId', '==', global.userId)
        .get();
      if (!spotifyRef.empty) {
        spotifyRef.forEach((doc) => {
          const {
            display_name,
            spotifyId,
            lastUpdated,
            country,
            provider
          } = doc.data();
          providers.push({
            id: doc.id,
            provider,
            display_name,
            spotifyId,
            country,
            lastUpdated
          });
        });
      }
      resolve(providers)
    } catch (error) {
      console.error(error)
      reject(error);
    }
  })
}

exports.removeProvider = (providerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const providers = await this.getProviders();
      const {
      id: providerId
      } = providers[0];
      // const provider = await this.getProvider(providerId);
      const spotifyRef = await global.Providers
        .doc(providerId)
        .delete();
      const sessionRef = await global.SessionsDB
        .where('authenticationId', '==', providerId)
        .where('userId', '==', global.userId)
        .limit(1)
        .get();
      // if(sessionRef.empty) {
      // return reject({ status: 404, message: `Provider ${providerId} does not exist for this Fonz account.` });
      // }
      sessionRef.forEach(async (doc) => {
        const sessionId = doc.id;
        const sessionRemove = await global.SessionsDB
          .doc(sessionId)
          .update({
            authenticationId: null
          });
      });

      resolve({
        message: `Removed provider ${providerId} from account.`
      });

    } catch (error) {
      console.error(error)
      reject(error);
    }
  });
}


// const sessionInformation = await global.SessionsDB
// .where('userId', '==', global.userId)
// .limit(1)
// .get();
// if (sessionInformation.empty) return reject({
// status: 404,
// message: 'No sessions active'
// });

exports.createSession = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sessionAlreadyExists = await global.SessionsDB
        .where('userId', '==', global.userId)
        .limit(1)
        .get();
      if (!sessionAlreadyExists.empty) return reject({
        status: 403,
        message: 'User already has an active session'
      });

      // const spotifyAuthId = await global.SpotifyDB
      //   .collection('authentication')
      //   .where('userId', '==', global.userId)
      //   .limit(1)
      //   .get();

      // if (spotifyAuthId.empty) return reject({
      //   status: 401,
      //   message: 'User does not have a Spotify account linked.'
      // });

      // let authenticationId;
      // spotifyAuthId.forEach((doc) => {
      //   authenticationId = doc.id;
      // });

      // const session = await global.SessionsDB.add({
      //   provider: 'Spotify', // hard coded for the moment
      //   userId: global.userId,
      //   authenticationId,
      //   active: true,
      //   createdAt: global.admin.firestore.FieldValue.serverTimestamp()
      // });

      const session = await global.SessionsDB.add({
        userId: global.userId,
        active: true,
        createdAt: global.admin.firestore.FieldValue.serverTimestamp()
      });

      resolve({
        status: 201,
        message: `Session ${session.id} has been created`,
        sessionId: session.id
      });
    } catch (error) {
      console.error(error)
      reject(error);
    }
  });
}

exports.getSession = () => {
  return new Promise(async (resolve, reject) => {
    try {
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
        const {
          createdAt,
          active,
          provider,
          authenticationId
        } = doc.data();
        resolve({
          sessionId,
          authenticationId,
          createdAt,
          provider,
          active
        })
      })
    } catch (error) {
      reject(error);
    }
  })
}

exports.deleteSession = (sessionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sessionInformation = await global.SessionsDB
        .doc(sessionId)
        .get();
      if (!sessionInformation.exists) return reject({
        status: 404,
        message: `Session ${sessionId} does not exist`
      });
      const {
        userId
      } = sessionInformation.data();
      if (userId !== global.userId) return reject({
        status: 403,
        message: 'This session ID is not linked to the given user account'
      })

      const res = await global.SessionsDB.doc(sessionId).delete();

      resolve()
    } catch (error) {
      reject(error);
    }
  });
}

exports.updateSession = (sessionId, active, authenticationId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sessionInformation = await global.SessionsDB
        .doc(sessionId)
        .get();
      if (!sessionInformation.exists) return reject({
        status: 404,
        message: `Session ${sessionId} does not exist`
      });
      const {
        userId
      } = sessionInformation.data();
      if (userId !== global.userId) return reject({
        status: 403,
        message: 'This session ID is not linked to the given user account'
      })

      const res = await global.SessionsDB
        .doc(sessionId)
        .update({
          active,
          authenticationId
        });

      resolve({
        status: 200,
        message: 'Session has been updated'
      })
    } catch (error) {
      reject(error);
    }
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

// exports.getSpotifyAccessAndRefreshToken = (userId) => {
//   return new Promise(async (resolve, reject) => {
//     const tokens = await global.SpotifyDB.collection('authentication')
//       .where('userId', '==', global.userId)
//       .limit(1)
//       .get();
//     if (tokens.empty) return reject({
//       status: 404,
//       message: "There is no Spotify account linked to this Fonz Account"
//     })
//     tokens.forEach((doc) => {
//       console.log(doc.id, '=>', doc.data());
//       resolve(doc.data())
//     });
//   });
// }

exports.userIsSessionActive = (sid) => {
  return new Promise((resolve, reject) => {
    User.getSessionInformation((err, sessionInformation) => {
      if (err) return reject(err);
      resolve(sessionInformation)
      // resolve({ activeSession: sessionInformation.active==1, sessionInformation});
    }, sid)
  });
}