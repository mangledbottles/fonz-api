import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import routers under /host */
// const CoasterRoutes: Router = require('./Coasters.route');
const Session = require('../controller/Sessions.controller');

router.get('/', (req: Request, res: Response) => {
    res.send({ message: "Guest Router"})
})

/* Coasters */

/* Get details of session from a coaster UID */
router.get('/coaster/:coasterId', async (req: Request, res: Response) => {
    try {
        const { coasterId } = req.params;
        const session = await Session.getCoasterSessionForGuest(coasterId);
        res.send(session)
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json(error);
    }
})

module.exports = router;