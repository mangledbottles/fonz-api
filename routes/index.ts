import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({ status: 200, message: "Fonzi API Server Active." })
});

module.exports = router;