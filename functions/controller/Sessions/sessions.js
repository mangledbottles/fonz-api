'use strict';
const Coasters = require('../coasters/coasters');

// TODO: Move Session controllers from Host.js to this file

exports.getCoasterSession = (coasterId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {
                userId,
                name: coasterName,
                paused: coasterPaused,
                active: coasterActive
            } = await Coasters.getUserCoaster(coasterId);
            const {
                sessionId,
                createdAt,
                provider,
                active: sessionActive
            } = await this.getUserSession(userId);

            const {
                displayName,
                photoURL
            } = await this.getHostInformation(userId);
            resolve({
                displayName,
                photoURL,
                userId,
                coasterName,
                coasterPaused,
                coasterPaused,
                coasterActive,
                sessionId,
                createdAt,
                provider,
                sessionActive
            });
        } catch (error) {
            reject(error);
        }
    });
}

exports.getUserSession = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sessionInformation = await global.SessionsDB
                .where('userId', '==', userId)
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

exports.getHostInformation = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            global.Auth_BE_CAREFUL_VERY_PRIVATE.getUser(userId).then((userRecord) => {
                const {
                    displayName,
                    photoURL
                } = userRecord.toJSON();
                resolve({
                    displayName,
                    photoURL
                });
            })
        } catch (error) {
            reject(error);
        }
    });
}