'use strict';

/* Import database configuration */
import { connect } from '../config/config';

/* Import entities */
import { Coasters } from '../entity/Coasters';
import { Session } from '../entity/Session';

exports.getCoasterSessionForGuest = (coasterId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const coasterRepo = connection.getRepository(Coasters);
            const sessionRepo = connection.getRepository(Session);

            const coaster = await coasterRepo.findOne({ where: { coasterId } });
            const session = await sessionRepo.findOne({ where: { userId: coaster.userId } }) || reject({ message: "No active session", status: 403 });

            resolve({ coaster, session });

        } catch (error) {
            console.error(error)
            reject(error)
        }
    });
}

exports.getSessionForGuest = (sessionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Session);

            const session = await repo.findOne({ where: { sessionId } }) || reject({ status: 404, message: `Session does not exit`});
            const musicProviders = await repo.findOne({ where: { sessionId }}) || reject({ status: 403, message: `No music providers are linked to this session`});

            resolve({ session, musicProviders });
        } catch (error) {
            console.error(error)
            reject(error);
        }
    })
}

exports.getProviderForGuest = (sessionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Session);

            const musicProviders = await repo.findOne({ where: { sessionId }}) || reject({ status: 403, message: `No music providers are linked to this session`});

            resolve(musicProviders);
        } catch (error) {
            console.error(error)
            reject(error);
        }
    })
}