import { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
const NAMESPACE = 'AuthVerify';

export const restJWTVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization) throw ({ status: 401, message: 'Unauthorised' })
        let token = req.headers.authorization.split(' ')[1];
        await verifyJWT(token);
        next();
    } catch (error) {
        res.status(error.status || 500).json(error);
    }
};

export const socketJWTVerify = async (socket: Socket, next: NextFunction) => {
    try {
        if (!socket.handshake.headers.authorisation) throw ({ status: 401, message: 'Unauthorised' })
        let token = socket.handshake.headers.authorisation;
        await verifyJWT(token);
        next();
    } catch (error) {
        next(new Error("unauthorized"))
    }
}

function verifyJWT(token) {
    return new Promise(async (resolve, reject) => {
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, decoded) => {
            if (error) {
                let resp = { message: "Authentication could not be completed." }
                switch (error.message) {
                    case 'invalid signature':
                        resp = { message: "Authentication not valid, invalid signature." }
                        break;
                    case 'jwt expired':
                        resp = { message: "Authentication token expired." }
                        break;
                }
                return reject({ status: 401, ...resp })
            }

            const { userId, admin } = decoded;
            if (admin) {
                globalThis.isAdmin = true;
                return resolve({})
            }
            /** Add userId to LoggingParams */
            globalThis.LoggingParams = { ...globalThis.LoggingParams, userId }
            globalThis.Logger.log('info', `[${NAMESPACE}] User Authenticated `, { ...globalThis.LoggingParams })

            globalThis.userId = userId;
            // res.locals.userId = userId;
            return resolve({})
        });
    })
}