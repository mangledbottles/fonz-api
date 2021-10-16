import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const NAMESPACE = 'AuthVerify';

export const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        let token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, decoded) => {
            if(error) {
                let resp = { message: "Authentication could not be completed."}
                switch(error.message) {
                    case 'invalid signature':
                        resp = { message: "Authentication not valid, invalid signature." }
                        break;
                    case 'jwt expired':
                        resp = { message: "Authentication token expired." }
                        break;
                }
                res.status(401).send(resp);
            }

            const { userId, admin } = decoded;
            if(admin) {
                globalThis.isAdmin = true;
                return next();
            }
            /** Add userId to LoggingParams */
            globalThis.LoggingParams = { ...globalThis.LoggingParams, userId }
            globalThis.Logger.log('info', `[${NAMESPACE}] User Authenticated `, { ...globalThis.LoggingParams })

            globalThis.userId = userId;
            res.locals.userId = userId;
            next();
        });
    } else {
        res.status(401).json({
            message: 'Unauthorized'
        });
    }
};
