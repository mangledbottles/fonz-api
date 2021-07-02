'use strict';

/* Import database configuration */
import { connect } from '../database/config';

/* Import entities */
import { Coasters } from '../entity/Coasters';

exports.getCoasters = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Coasters);

            let coasters = await repo.find({ where: { userId }});
            resolve(coasters)

        } catch(error) {
            console.error(error);
            reject({})
        }
    })
}