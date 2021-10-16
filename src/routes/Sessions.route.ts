import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();
const NAMESPACE = "Sessions";

/** Import controllers */
const Sessions = require('../controller/Sessions.controller');

router.get('/', async (req: Request, res: Response) => {
    globalThis.Logger.log('info', `[${NAMESPACE}] User getting their Sessions `, { ...globalThis.LoggingParams })

    try {
        const sessions = await Sessions.getAllSessions();
        res.send(sessions);
    } catch (error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Get Sessions `, { ...globalThis.LoggingParams, error },)

        res.status(error.status || 500).send(error);
    }
})

router.get('/:sessionId', async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    try {
        globalThis.Logger.log('info', `[${NAMESPACE}] User getting Session (one) `, { ...globalThis.LoggingParams, sessionId })

        const session = await Sessions.getSessionById(sessionId);
        res.send(session);
    } catch (error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Get Session (one) `, { ...globalThis.LoggingParams, error, sessionId },)
        
        res.status(error.status || 500).send(error);
    }
})

router.delete('/:sessionId', async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    try {
        globalThis.Logger.log('info', `[${NAMESPACE}] User deleting Session (one) `, { ...globalThis.LoggingParams, sessionId })

        await Sessions.deleteSession(sessionId);
        res.status(204);
    } catch (error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Delete Session (one) `, { ...globalThis.LoggingParams, error, sessionId },)

        res.status(error.status || 500).send(error);
    }
});

router.put('/:sessionId', async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    try {
        const { active, providerId } = req.body;
        globalThis.Logger.log('info', `[${NAMESPACE}] User updating Session (one) `, { ...globalThis.LoggingParams, params: { active, providerId }, sessionId })
        
        const updatedSession = await Sessions.updateSession(sessionId, active, providerId);
        return res.send(updatedSession)
    } catch (error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Update Session `, { ...globalThis.LoggingParams, error, sessionId },)

        return res.status(error.status || 500).send(error);
    }
})

router.post('/', async (req: Request, res: Response) => {
    try {
        globalThis.Logger.log('info', `[${NAMESPACE}] User creating Session (one) `, { ...globalThis.LoggingParams })

        const session = await Sessions.createSession();
        res.send(session);
    } catch (error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Create Session `, { ...globalThis.LoggingParams, error },)

        res.status(error.status || 500).send(error);
    }
})

module.exports = router;