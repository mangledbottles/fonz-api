import express, { IRouter, Request, Response, Router } from "express";
var router: IRouter = express.Router();

/** Import routers under /host */
const CoasterRoutes: Router = require('./Coasters.route');

router.get('/', (req: Request, res: Response) => {
    res.send({ message: "HOST AUTHENTICATED"})
})

/* Coasters */
router.use('/coasters', CoasterRoutes);

module.exports = router;