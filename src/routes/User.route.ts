import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();
const NAMESPACE = "User";

/** Import controllers */
const User = require('../controller/User.controller');

router.put('/', async (req: Request, res: Response) => {
    try {
        globalThis.Logger.log('info', `[${NAMESPACE}] Updating User Account `, { ...globalThis.LoggingParams})
        
        const { displayName, email, password, agreedMarketing, agreedConsent } = req.body;
        const user = await User.updateAccount(email, displayName, password, agreedMarketing, agreedConsent);
        res.send(user);
    } catch(error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Update User Account`, { ...globalThis.LoggingParams, error },)

        res.status(error.status || 500).send(error);
    }
})

router.get('/', async (req: Request, res: Response) => {
    try {
        globalThis.Logger.log('info', `[${NAMESPACE}] Get User Account `, { ...globalThis.LoggingParams})

        const user = await User.getAccount();
        res.send(user);
    } catch(error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Get User Account`, { ...globalThis.LoggingParams, error },)

        res.status(error.status || 500).send(error);
    }
})

module.exports = router;