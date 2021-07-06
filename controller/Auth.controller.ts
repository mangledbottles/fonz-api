'use strict';

/* Import database configuration */
import { connect } from '../config/config';

/* Import entities */
import { Users } from '../entity/Users'; 
// import { MusicProviders } from '../entity/MusicProviders'; 

/* Import interfaces */
import { IUserSignIn } from "../interfaces/User.interface";
import { IJwt } from "../interfaces/JWT.interface";

/* Import dependecies */
const jwt = require("jsonwebtoken");

class Jwtoken implements IJwt {
    iss: string = "https://api.fonzmusic.com/auth"
    userId: string;
    sub: string;
    email: string;
    emailVerified: boolean;
    exp: number = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 14); // 2 week authentication
    // exp: number = Math.floor(Date.now() / 1000) + 1;

    constructor(userId: string, email: string, emailVerified: boolean) {
        this.userId = userId;
        this.email = email;
        this.emailVerified = emailVerified;
    }

    getPayload(): object {
        return { iss: this.iss, exp: this.exp, userId: this.userId, 
            sub: this.userId, email: this.email, emailVerified: this.emailVerified };
    }

}

// class UserRegisterEmailPassword {
//     email: string;
//     password: string;

//     constructor(email: string, password: string) {
//         this.email = email;
//         this.password = password;
//     }

//     validateEmail() {
//         const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//         return re.test(String(this.email).toLowerCase());
//     }

//     validatePassword() {
//         return this.password.length >= 12 && this.password.length < 256;
//     }

// }

exports.signIn = (email, password: IUserSignIn) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const User = await connection.getRepository(Users);
            const accountDetails = await User.findOne({ where: { email, password } });
            
            if(!accountDetails) return reject({ status: 404, message: "Incorrect password."})

            const { userId, emailVerified } = accountDetails;

            const jwtConfig = new Jwtoken(userId, email, emailVerified);
            const accessToken = jwt.sign(jwtConfig.getPayload(), process.env.JWT_PRIVATE_KEY);

            resolve({ accessToken })

        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

exports.signUp = (email: string, password: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();

            

            let User = await connection.getRepository(Users).create({ email, password });
            const saved = await connection.manager.save(User);

            const jwtConfig = new Jwtoken(saved.userId, email, false);
            const accessToken = jwt.sign(jwtConfig.getPayload(), process.env.JWT_PRIVATE_KEY);
            resolve({ ...saved, accessToken })

        } catch (error) {
            if(error.code == "ER_DUP_ENTRY") reject({ status: 403, message: "There is an account already using this email." })
            
            console.error(error)
            reject({ message: error.message })
        }
    })
}


// let MusicProv = new MusicProviders();
            // MusicProv.userId = "509f4484-6830-4f17-aac9-707ccef96fae";
            // MusicProv.userId = "3acaa0e4-fa32-46ee-a17b-50d9a08665d4";
            // const saved = await connection.manager.save(MusicProv);
            // console.log({ saved, MusicProv })
            // resolve(saved);


            // let User = new Users();
            // User.email = "ROHAN@test.com";
            // console.log(User)
            // const saved = await connection.manager.save(User);
            // resolve(saved);

            // const repo = await connection.getRepository(Users);
            // const allUsers = await repo.find(); // get all users
            // console.log({ allUsers })
            // resolve(allUsers);