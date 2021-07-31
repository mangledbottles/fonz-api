'use strict';

/** Import database configuration */
import { connect } from '../config/config';

/** Import entities */
import { Users } from '../entity/Users';

/** Import dependecies */
import bcryptjs from "bcryptjs";

exports.updateAccount = (email?: string, displayName?: string, password?: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await connect();
            const repo = connection.getRepository(Users);

            const userId = globalThis.userId;
            const account = await repo.findOne({ where: { userId } });

            if (email) account.email = email;
            if (displayName) account.displayName = displayName;
            if (password) {
                // Generate password salt and create hash with password and salt 📩
                const passwordSalt = await bcryptjs.genSalt(10);
                const passwordHash = await bcryptjs.hash(password, passwordSalt);
                
                account.password = passwordHash;
                account.passwordSalt = passwordSalt;
            }
                    
            const saved = await repo.save(account);

            // Security 🔐
            delete saved.password;
            delete saved.passwordSalt;

            resolve(saved);

        } catch (error) {
            if (error?.code == "ER_DUP_ENTRY") reject({ status: 409, message: "This email is already in use" });
            reject(error);
        }
    });
}