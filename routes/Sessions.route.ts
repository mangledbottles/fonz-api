import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
const Sessions = require('../controller/Sessions.controller');

router.get('/', async (req: Request, res: Response) => {
    try {
        const sessions = await Sessions.getAllSessions();
        res.send(sessions);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send(error);
    }
})

router.get('/:sessionId', async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const session = await Sessions.getSessionById(sessionId);
        res.send(session);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send(error);
    }
})

router.delete('/:sessionId', async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        await Sessions.deleteSession(sessionId);
        res.status(204);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send(error);
    }
});

router.put('/:sessionId', async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const { active, providerId } = req.body;
        console.log({ providerId, active })

        const updatedSession = await Sessions.updateSession(sessionId, active, providerId);
        return res.send(updatedSession)
    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).send(error);
    }
    // await Host.updateSession(sessionId, (active == 'true'), authenticationId);

    // Host.updateSession(sessionId, (active == 'true'), authenticationId).then((resp) => {
    //     res.status(resp.status || 200).json(resp);
    // }).catch((err) => {
    //     res.status(err.status || 500).json(err);
    // })
})

router.post('/', async (req: Request, res: Response) => {
    try {
        const session = await Sessions.createSession();
        res.send(session);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send(error);
    }
})

module.exports = router;