import jwt from 'jsonwebtoken';
// import config from '../config/config';
import logging from '../config/logging';
import { Request, Response, NextFunction } from 'express';

const NAMESPACE = 'Auth';

const extractJWT = (req: Request, res: Response, next: NextFunction) => {
    logging.info(NAMESPACE, 'Validating token');

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

            const { userId } = decoded;
            globalThis.userId = userId;
            res.locals.userId = userId;
            console.log(`Authorised User ID ${userId}`);
            next();
        });
    } else {
        res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

export default extractJWT;