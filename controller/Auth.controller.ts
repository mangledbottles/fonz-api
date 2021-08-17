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
import bcryptjs from "bcryptjs";
import { v4 as uuid } from 'uuid';


class Jwtoken implements IJwt {
    iss: string = "https://api.fonzmusic.com/auth"
    userId: string;
    sub: string;
    email: string;
    emailVerified: boolean;
    exp: number = Math.floor(Date.now() / 1000) + (60 * 60 * 24); // 1 day authentication

    constructor(userId: string, email: string, emailVerified: boolean) {
        this.userId = userId;
        this.email = email;
        this.emailVerified = emailVerified;
    }

    getPayload(): object {
        return { iss: this.iss, exp: this.exp, userId: this.userId, sub: this.userId };
    }

    static validateEmail(email): boolean {
        if(!email || typeof email != "string") return false;
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    static validatePassword(password): boolean {
        if(!password || typeof password != "string") return false;
        return password.length >= 8 && password.length < 71;
    }
}

function generateRefreshToken(): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = await bcryptjs.genSalt(10);
            const refreshToken: string = await bcryptjs.hash(uuid(), salt);
            resolve(refreshToken);
        } catch (error) {
            reject(error);
        }
    });

}

exports.signIn = (email, password: IUserSignIn) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();

            // Validate email and password inputs
            if (!Jwtoken.validateEmail(email)) return reject({
                status: 401,
                message: "Invalid email address provided."
            })
            if (!Jwtoken.validatePassword(password)) return reject({
                status: 401,
                message: "Invalid password provided, password should be atleast 12 characters long and less than 72"
            })

            // Get user with given email address
            const User = await connection.getRepository(Users);
            const accountDetails = await User.findOne({ where: { email } });
            
            // If no account is linked to given email
            if(!accountDetails) return reject({ status: 404, message: "There is no account linked with this email address."});

            
            // Check if correct password
            const passwordCompare = await bcryptjs.compare(password, accountDetails.password);
            console.log({ passwordCompare })
            if(!passwordCompare) return reject({ status: 401, message: "Incorrect password provided for this account."})

            // Create access token
            const { userId, emailVerified, refreshToken } = accountDetails;
            const jwtConfig = new Jwtoken(userId, email, emailVerified);
            const accessToken = jwt.sign(jwtConfig.getPayload(), process.env.JWT_PRIVATE_KEY);

            resolve({ accessToken, refreshToken });

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

            // Validate email and password inputs
            if(!Jwtoken.validateEmail(email)) return reject({
                status: 401,
                message: "Invalid email address provided."
            })
            if(!Jwtoken.validatePassword(password)) return reject({
                status: 401,
                message: "Invalid password provided, password should be atleast 12 characters long and less than 72"
            })

            // Generate password salt and create hash with password and salt 📩
            const passwordSalt = await bcryptjs.genSalt(10);
            const passwordHash = await bcryptjs.hash(password, passwordSalt);
    
            // Create Refresh Token
            const refreshToken: string = await generateRefreshToken();

            // Insert User into database 🖥️
            let User = await connection.getRepository(Users).create({ email, password: passwordHash, passwordSalt, refreshToken });
            const saved = await connection.manager.save(User);

            // Security 🔐
            delete saved.password;
            delete saved.passwordSalt;

            // Create access token for new account
            const jwtConfig = new Jwtoken(saved.userId, email, false);
            const accessToken = jwt.sign(jwtConfig.getPayload(), process.env.JWT_PRIVATE_KEY);

            resolve({ ...saved, accessToken })

        } catch (error) {
            if(error.code == "ER_DUP_ENTRY") return reject({ status: 403, message: "There is an account already using this email." })
            
            console.error(error)
            reject({ message: error.message })
        }
    })
}

/** TODO: Rate limit account creations */
exports.createAnonymousAccount = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();

            // Create Refresh Token
            const refreshToken: string = await generateRefreshToken();
    
            // Insert User into database 🖥️
            let User = await connection.getRepository(Users).create({ refreshToken });
            const saved = await connection.manager.save(User);

            // Create access token for new account
            const jwtConfig = new Jwtoken(saved.userId, "anonymous", false);
            const accessToken = jwt.sign(jwtConfig.getPayload(), process.env.JWT_PRIVATE_KEY);

            resolve({ ...saved, accessToken, refreshToken })

        } catch (error) {
            if(error.code == "ER_DUP_ENTRY") return reject({ status: 403, message: "There is an account already using this email." })
            
            console.error(error)
            reject({ message: error.message })
        }
    })
}

exports.refreshToken = (userId, refreshToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Users);

            // Check if userId and Refresh Token are valid
            const account = await repo.findOne({ where: { userId, refreshToken }});
            if(!account) reject({ status: 404, message: "Invalid refresh token provided, login again"});

            // Create access token for new account
            const jwtConfig = new Jwtoken(account.userId, "", false);
            const accessToken = jwt.sign(jwtConfig.getPayload(), process.env.JWT_PRIVATE_KEY);

            resolve({ accessToken });
        } catch(error) {
            reject(error);
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