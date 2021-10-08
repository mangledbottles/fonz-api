import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

const IOS_MINIMUM_APP_VERSION = "2.04";
const ANDROID_MINIMUM_APP_VERSION = "2.0.1";

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({ status: 200, message: "Fonzi API Server Active." })
});

router.get('/version', (req: Request, res: Response) => {
    const { device } = req.query;
    if (!device) return res.status(400).json({ message: "Invalid device provided" });

    const minimumAppVersion: String = (device == "iOS") ? IOS_MINIMUM_APP_VERSION : ANDROID_MINIMUM_APP_VERSION;

    return res.json({
        apiVersion: 1.01,
        minimumAppVersion
    });

})

module.exports = router;