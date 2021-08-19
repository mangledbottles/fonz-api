import express, { IRouter, Request, Response, Router } from "express";
var router: IRouter = express.Router();

/** Import routers under /host */
const CoasterRoutes: Router = require('./Coasters.route');
const SessionRoutes: Router = require('./Sessions.route');


router.get('/', (req: Request, res: Response) => {
    res.send({ message: "HOST AUTHENTICATED"})
})

/* Coasters */
router.use('/coasters', CoasterRoutes);

/* Sessions */
router.use('/session', SessionRoutes);

module.exports = router;