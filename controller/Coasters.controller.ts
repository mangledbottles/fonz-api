'use strict';

/* Import database configuration */
import { connect } from '../database/config';

/* Import entities */
import { Coasters } from '../entity/Coasters';

exports.getCoasters = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Coasters);

            // let coasters = await repo.find({ where: { userId: global.userId }});
            let coasters = {};
            // console.log({ coasters })
            resolve({ coasters })

        } catch(error) {
            console.error(error);
            reject({})
        }
    })
}