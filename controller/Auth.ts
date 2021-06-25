'use strict';

import { connect } from '../database/config';
import { User } from '../entity/User';

exports.signIn = (username: string, password: string) => {
    console.log("controller called")
    return new Promise(async (resolve, reject) => {
        try {
            console.log("trying db")
            const connection = await connect();
            const repo = await connection.getRepository(User);
            console.log({ repo })
            const allUsers = await repo.find();
            console.log({ allUsers })
            console.log("none")            
            resolve(allUsers);
            
        } catch(error) {
            console.log(error + "ERROR`")
            reject(error);
        }
    })
}