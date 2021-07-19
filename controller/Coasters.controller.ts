'use strict';

/* Import database configuration */
import { connect } from '../config/config';

/* Import entities */
import { Coasters } from '../entity/Coasters';

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
            if (!coaster) return reject({
                status: 404,
                message: 'This coaster does not exist.'
            });

            const { userId } = coaster;
            if ((userId !== currentUserId) && (userId !== null)) return reject({
                status: 404,
                message: 'This coaster is already linked to a different Fonz account. That account must disconnect that coaster before you can add it to your account.'
            });
            if (userId == currentUserId) return reject({
                status: 403,
                message: 'This coaster is already linked to your account.'
            })
            if (userId == null) {

                const updatedCoaster = await repo.save({
                    ...coaster,
                    userId: currentUserId,
                    active: true,
                    name: ''
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


exports.updateCoaster = (currentUserId, coasterId, params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Coasters);

            const { name, active } = params;
            if (!name || !active) return reject({
                status: 400,
                message: 'No valid parameters have been passed.'
            });

            let [coaster] = await repo.find({ where: { coasterId } });
            if (!coaster) return reject({
                status: 404,
                message: 'This coaster does not exist.'
            });

            if (coaster.userId !== currentUserId) return reject({
                status: 404,
                message: 'This coaster is not linked to this Fonz account.'
            });


            coaster.active = ((active == undefined) ? coaster.name : active);
            coaster.name = ((name == undefined) ? coaster.name : name);

            await repo.save(coaster);

            resolve({
                name,
                active
            })

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
        if (!coaster) return reject({
            status: 404,
            message: 'This coaster does not exist.'
        });

        if (coaster.userId !== currentUserId) return reject({
            status: 404,
            message: 'This coaster is not linked to this Fonz account.'
        });

        /** Remove userId and set active to false */
        coaster.userId = null;
        coaster.active = false;

        await repo.save(coaster);

        resolve({
            message: 'Coaster removed from Fonz account.'
        })
    })
}