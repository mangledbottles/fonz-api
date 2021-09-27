'use strict';

/** Import database configuration */
import { connect } from '../config/config';

/** Import entities */
import { Users } from '../entity/Users';

/** Import dependecies */
import bcryptjs from "bcryptjs";
import { AUTH_USER_EMAIL_EXISTS } from '../config/messages';

exports.updateAccount = (email?: string, displayName?: string, password?: string, agreedMarketing?: boolean, agreedConsent?: boolean) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Users);

            const userId = globalThis.userId;
            const account = await repo.findOne({ where: { userId } });

            if (email != undefined && email !== account.email) account.email = email;
            if (displayName != undefined) account.displayName = displayName;
            if (password != undefined) {
                // Generate password salt and create hash with password and salt 📩
                const passwordSalt = await bcryptjs.genSalt(10);
                const passwordHash = await bcryptjs.hash(password, passwordSalt);

                account.password = passwordHash;
                account.passwordSalt = passwordSalt;
            }
            if (agreedMarketing != undefined) account.agreedMarketing = agreedMarketing;
            if (agreedConsent != undefined) account.agreedConsent = agreedConsent;

            const saved = await repo.save(account);

            // Security 🔐
            delete saved.password;
            delete saved.passwordSalt;

            resolve(saved);

        } catch (error) {
            if (error?.code == "ER_DUP_ENTRY") reject(AUTH_USER_EMAIL_EXISTS);
            reject(error);
        }
    });
}

exports.getAccount = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Users);

            const userId = globalThis.userId;
            const account = await repo.findOne({ where: { userId } });

            // Security 🔐
            delete account.password;
            delete account.passwordSalt;

            resolve(account);
        } catch (error) {
            reject(error);
        }
    });
}