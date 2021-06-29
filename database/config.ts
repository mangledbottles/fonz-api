import { ConnectionOptions, Connection, createConnection, getConnection } from 'typeorm';
import 'reflect-metadata';
// import { Coasters } from '../entity/Coaster';
import { MusicProviders } from '../entity/MusicProviders';
// import { Provider } from '../entity/Provider';
// import { Session } from '../entity/Session';
import { Users } from '../entity/Users';

// Will be true on deployed functions
export const prod: boolean = process.env.NODE_ENV === 'production';

export const config: ConnectionOptions = {
    name: 'fonz',
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // review
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,
    // entities: [Coasters, MusicProvider, Provider, Session, Users],
    entities: [ Users, MusicProviders ],

    // Production Mode
    ...(prod && {
        logging: false,
        // synchronize: false,
        // extra: {
        //     socketPath: '/cloudsql/YOUR_CONNECTION_NAME' // change
        // },
    })
}

export const connect = async () => {

    let connection: Connection;

    try {
        connection = getConnection(config.name)
    } catch (err) {
        connection = await createConnection(config);
    }

    return connection;
}
