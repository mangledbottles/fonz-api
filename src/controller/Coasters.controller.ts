'use strict';

/* Import database configuration */
import { connect } from '../config/config';
import { COASTERS_LINKED, COASTERS_LINK_EXISTS, COASTERS_NOT_FOUND, COASTERS_NOT_LINKED, COASTER_ACC_REVOKED } from '../config/messages';

/* Import entities */
import { Coasters } from '../entity/Coasters';

// import { COASTERS_ACCOUNT_LINKED } from '../config/Error';

exports.getCoasters = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Coasters);

            let [coasters, quantity] = await repo.findAndCount({ where: { userId } });
            resolve({ coasters, quantity });

        } catch (error) {
            console.error(error);
            reject(error);
        }
    })
}

exports.getCoastersById = (userId, coasterId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Coasters);

            let [coaster] = await repo.find({ where: { userId, coasterId } });
            resolve(coaster);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

exports.addCoaster = (currentUserId, coasterId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Coasters);

            const [coaster] = await repo.find({ where: { coasterId } });            
            if (!coaster) return reject(COASTERS_NOT_FOUND);

            const { userId } = coaster;
            if ((userId !== currentUserId) && (userId !== null)) return reject(COASTERS_LINK_EXISTS);
            if (userId == currentUserId) return reject(COASTERS_LINKED)
            if (userId == null) {

                const updatedCoaster = await repo.save({
                    ...coaster,
                    userId: currentUserId,
                    active: true,
                });

                resolve({
                    message: `Coaster has been linked to your account.`,
                    ...updatedCoaster
                })
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}


exports.updateCoaster = (coasterId, { name, active, encoded }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Coasters);

            let [coaster] = await repo.find({ where: { coasterId } });

            if (!coaster) return reject(COASTERS_NOT_FOUND);

            const currentUserId = globalThis.userId;
            if (coaster.userId !== currentUserId) return reject(COASTERS_NOT_LINKED);

            if(name) coaster.name = name;
            if(active != undefined) coaster.active = active;
            if(encoded != undefined) coaster.encoded = encoded;
            const updatedCoaster =await repo.save(coaster);

            resolve(updatedCoaster)

        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

exports.removeCoaster = (currentUserId, coasterId) => {
    return new Promise(async (resolve, reject) => {
        const connection = await connect();
        const repo = connection.getRepository(Coasters);

        let [coaster] = await repo.find({ where: { coasterId } });
        if (!coaster) return reject(COASTERS_NOT_FOUND);

        if (coaster.userId !== currentUserId) return reject(COASTERS_NOT_LINKED);

        /** Remove userId and set active to false */
        coaster.userId = null;
        coaster.active = false;

        await repo.save(coaster);

        resolve(COASTER_ACC_REVOKED)
    })
}