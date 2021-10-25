'use strict';

import { Repository } from 'typeorm';
/* Import database configuration */
import { connect } from '../config/config';
import { COASTERS_NOT_FOUND, COASTERS_NOT_LINKED, COASTER_ACC_REVOKED } from '../config/messages';

/* Import entities */
import { Coasters } from '../entity/Coasters';
import { Session } from '../entity/Session';
import { Users } from '../entity/Users';

exports.updateCoaster = (coasterId, { encoded, group }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Coasters);

            let [coaster] = await repo.find({ where: { coasterId } });

            if (!coaster) return reject({
                status: 404,
                message: 'This coaster does not exist.'
            });

            if (encoded != null) coaster.encoded = encoded;
            if (group) coaster.group = group;
            const updatedCoaster = await repo.save(coaster);

            resolve(updatedCoaster)

        } catch (error) {
            reject(error)
        }
    })
}

exports.addCoaster = (coasterId: string, { group }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            let Coaster = await connection.getRepository(Coasters).create({ coasterId, group, active: false });
            const saved = await connection.manager.save(Coaster);

            resolve(saved);
        } catch (error) {
            reject(error);
        }
    })
}

exports.getCoaster = (coasterId: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const coasterRepo = connection.getRepository(Coasters);
            const sessionRepo = connection.getRepository(Session);
            const usersRepo = connection.getRepository(Users);

            let [coaster] = await coasterRepo.find({ where: { coasterId } });
            let [session] = await sessionRepo.find({ where: { userId: coaster.userId, active: true } });
            let [user] = await usersRepo.find({ where: { userId: coaster.userId }});
            let { userId, email, displayName, createdAt } = user;
        
            resolve({ coaster, session, user: { userId, email, displayName, createdAt } });
        } catch (error) {
            reject(error);
        }
    });
}

/** Remove user from coaster */
exports.releaseCoaster = (coasterId) => {
    return new Promise(async (resolve, reject) => {
        const connection = await connect();
        const repo = connection.getRepository(Coasters);

        let [coaster] = await repo.find({ where: { coasterId } });
        if (!coaster) return reject(COASTERS_NOT_FOUND);

        /** Remove userId and set active to false */
        coaster.userId = null;
        coaster.active = false;

        await repo.save(coaster);

        resolve(COASTER_ACC_REVOKED)
    })
}