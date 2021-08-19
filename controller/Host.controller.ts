'use strict';

/** Import database configuration */
import { connect } from '../config/config';
import { MusicProviders } from '../entity/MusicProviders';

exports.getMusicProviders = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const musicProviderRepo = connection.getRepository(MusicProviders);

            const userId = globalThis.userId;
            const musicProviders = await musicProviderRepo.find({ userId });

            resolve(musicProviders);
        } catch (error) {
            reject(error);
        }
    });
}