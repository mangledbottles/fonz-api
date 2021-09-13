'use strict';

/* Import database configuration */
import { connect } from '../config/config';

/* Import entities */
import { Coasters } from '../entity/Coasters';
import { MusicProviders } from '../entity/MusicProviders';
import { Session } from '../entity/Session';
import { Users } from '../entity/Users';

exports.getCoasterSessionForGuest = (coasterId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const coasterRepo = connection.getRepository(Coasters);
            const sessionRepo = connection.getRepository(Session);
            const usersRepo = connection.getRepository(Users);

            const coaster = await coasterRepo.findOne({ where: { coasterId } });
            if(coaster?.userId == undefined || null) reject({ message: "There coaster does not have a host.", status: 403, code: "COASTER_NO_HOST" });
            const session = await sessionRepo.findOne({ where: { userId: coaster.userId } }) || reject({ message: "No active session", status: 403 });
            const host = await usersRepo.findOne({ where: { userId: coaster.userId }});

            const hostName = host.displayName;

            resolve({ coaster, session, hostName });

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
            const sessionRepo = connection.getRepository(Session);
            const musicProvidersRepo = connection.getRepository(MusicProviders);

            const session = await sessionRepo.findOne({ where: { sessionId } }) || reject({ status: 404, message: `Session does not exit`});
            const musicProviders = await musicProvidersRepo.findOne({ where: { sessionId }}) || reject({ status: 403, message: `No music providers are linked to this session`});

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


exports.createSession = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const sessionRepo = connection.getRepository(Session);

            const userId = globalThis.userId;
            let session = new Session();

            session.userId = userId;
            resolve(await sessionRepo.save(session));

        } catch (error) {
            reject(error);
        }
    });
}

exports.getSessionById = (sessionId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const sessionRepo = connection.getRepository(Session);

            const userId = globalThis.userId;
            const session = await sessionRepo.findOne({ where: { userId, sessionId } })
            if (!session) reject({ status: 403, message: "No active sessions" });

            resolve(session);

        } catch (error) {
            reject(error);
        }
    })
}

exports.getAllSessions = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const sessionRepo = connection.getRepository(Session);

            const userId = globalThis.userId;
            const session = await sessionRepo.find({ where: { userId } })
            if (!session) reject({ status: 403, message: "No sessions linked to this user" });

            resolve(session);
        } catch (error) {
            reject(error);
        }
    })
}

exports.deleteSession = (sessionId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const sessionRepo = connection.getRepository(Session);

            const userId = globalThis.userId;
            const session = await sessionRepo.findOne({ where: { userId, sessionId } })
            if (!session) reject({ status: 403, message: "Session does not exist." });

            await sessionRepo.delete(session);

            resolve({});

        } catch (error) {
            reject(error);
        }
    })
}

exports.updateSession = (sessionId: string, active?: boolean, providerId?: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const sessionRepo = connection.getRepository(Session);
            const musicProviderRepo = connection.getRepository(MusicProviders);

            const userId = globalThis.userId;
            const session = await sessionRepo.findOne({ where: { userId, sessionId } })
            if (!session) reject({ status: 403, message: "No active session / session does not exist" });

            console.log({ providerId, active, session })

            /** If requested, update Session status */
            if (active != undefined) {
                console.log("UPDATE STATUS")
                // Save Session
                session.active = active;
                await sessionRepo.save(session);
            }

            /** If requested, music provider will be linked to Session */
            if (providerId != undefined) {
                console.log("UPDATE PROVIDER")

                const musicProvider = await musicProviderRepo.findOne({ where: { providerId } });
                if(!musicProvider) reject({ status: 404, message: "Music provider does not exist"});
                musicProvider.sessionId = sessionId;

                // Save Music Provider ans Session
                session.provider = musicProvider.provider;
                await sessionRepo.save(session);
                await musicProviderRepo.save(musicProvider);
            }

            resolve({ message: 'Session has been updated', session })
        } catch (error) {
            reject(error);
        }
    });
}