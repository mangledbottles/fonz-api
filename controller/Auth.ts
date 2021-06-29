'use strict';

import { connect } from '../database/config';
import { Coasters } from '../entity/Coasters';
// import { Users } from '../entity/Users'; 
import { MusicProviders } from '../entity/MusicProviders'; 


exports.signIn = (username: string, password: string) => {
    console.log("controller called")
    return new Promise(async (resolve, reject) => {
        try {
            console.log("trying db")
            const connection = await connect();

            let MusicProv = new MusicProviders();
            // MusicProv.userId = "509f4484-6830-4f17-aac9-707ccef96fae";
            MusicProv.userId = "3acaa0e4-fa32-46ee-a17b-50d9a08665d4";
            const saved = await connection.manager.save(MusicProv);
            resolve(saved);


            // let User = new Users();
            // User.email = "ROHAN@test.com";
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

exports.getCoasters = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Coasters);

            let coaster = await repo.findOne()

            let coasters = await repo.find();

            console.log({ coasters })
            resolve({ coasters })

        } catch(error) {
            console.error(error);
            reject({})
        }
    })
}