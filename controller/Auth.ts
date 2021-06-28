'use strict';

import { connect } from '../database/config';
// import { Coasters } from '../entity/Coaster';
// import { Users } from '../entity/Users'; 
import { MusicProviders } from '../entity/MusicProviders'; 


exports.signIn = (username: string, password: string) => {
    console.log("controller called")
    return new Promise(async (resolve, reject) => {
        try {
            console.log("trying db")
            const connection = await connect();

            let MusicProv = new MusicProviders();
            MusicProv.userId = "509f4484-6830-4f17-aac9-707ccef96fae";
            const saved = await connection.manager.save(MusicProv);

            resolve(saved);

            // let User = new Users();
            // User.email = "DERMOT@test.com";
            // console.log(User)
            // const saved = await connection.manager.save(User);
            // resolve(saved);

            // const repo = await connection.getRepository(Users);
            // const allUsers = await repo.find(); // get all users
            // console.log({ allUsers })
            // resolve(allUsers);
            
        } catch(error) {
            console.error(error)
            // console.log(error + "ERROR`")
            // reject(error);
            reject({})
        }
    })
}