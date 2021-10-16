import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();
const NAMESPACE = 'Admin';

/** Import controllers */
const Admin = require('../controller/Admin.controller');

router.use((req, res, next) => {
    globalThis.Logger.log('info', `[${NAMESPACE}] Verifying user isAdmin `, { ...globalThis.LoggingParams, })

    try {
        if(globalThis.isAdmin) {
            next();
        } else {
            globalThis.Logger.log('error', `[${NAMESPACE}] User is not Admin `, { ...globalThis.LoggingParams, })
            res.status(404).send({ message: "Not found" });
        }
    } catch(error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not check if user is Admin `, { ...globalThis.LoggingParams, error })

        res.send(error);
    }
});

router.get('/', (req: Request, res: Response) => {
    res.send("ADMIN")
});

router.put('/coasters/:coasterId', async (req: Request, res: Response) => {
    try {
        const { coasterId } = req.params;
        const { encoded, group } = req.body;
        globalThis.Logger.log('info', `[${NAMESPACE}] Update Coaster `, { ...globalThis.LoggingParams, params: { coasterId, group, encoded } })

        res.send(await Admin.updateCoaster(coasterId, { encoded, group }));
    } catch(error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Update Coaster `, { ...globalThis.LoggingParams, error })

        res.send(error);
    }
});

module.exports = router;