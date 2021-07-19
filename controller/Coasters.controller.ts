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

            let [ coasters, quantity ] = await repo.findAndCount({ where: { userId }});
            resolve({ coasters, quantity });

        } catch(error) {
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

            let [ coaster ] = await repo.find({ where: { userId, coasterId }});
            resolve(coaster);
        } catch(error) {
            console.error(error);
            reject(error);
        }
    });
}


