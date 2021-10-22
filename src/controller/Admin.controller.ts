'use strict';

/* Import database configuration */
import { connect } from '../config/config';

/* Import entities */
import { Coasters } from '../entity/Coasters';

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
}