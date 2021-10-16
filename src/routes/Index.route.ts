import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();
const NAMESPACE = "Index";

const IOS_MINIMUM_APP_VERSION = "1.24";
const ANDROID_MINIMUM_APP_VERSION = "1.0.5";

router.get('/', (req: Request, res: Response) => {
    globalThis.Logger.log('info', `[${NAMESPACE}] User checking Fonz Server Status `, { ...globalThis.LoggingParams })

    res.status(200).json({ status: 200, message: "Fonzi API Server Active." })
});

router.get('/version', (req: Request, res: Response) => {
    const { device } = req.query;
    if (!device) return res.status(400).json({ message: "Invalid device provided" });

    globalThis.Logger.log('info', `[${NAMESPACE}] User checking their app version against minimum `, { ...globalThis.LoggingParams, params: { device }})

    const minimumAppVersion: String = (device == "iOS") ? IOS_MINIMUM_APP_VERSION : ANDROID_MINIMUM_APP_VERSION;

    return res.json({
        apiVersion: 1.01,
        minimumAppVersion
    });

})

module.exports = router;