import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
const Admin = require('../controller/Admin.controller');

router.use((req, res, next) => {
    try {
        if(globalThis.isAdmin) {
            next();
        } else {
            res.status(404).send({ message: "Not found" });
        }
    } catch(error) {
        res.send(error);
    }
});

router.get('/', (req: Request, res: Response) => {
    res.send("ADMIN")
});

router.post('/coasters/:coasterId', async (req: Request, res: Response) => {
    try {
        const { coasterId } = req.params;
        const { encoded, group } = req.body;
        res.send(await Admin.updateCoaster(coasterId, { encoded, group }));
    } catch(error) {
        console.error(error);
        res.send(error);
    }
});

module.exports = router;