import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();
const NAMESPACE = 'Coasters';


/** Import controllers */
const Coaster = require('../controller/Coasters.controller');

router.get('/', (req: Request, res: Response) => {
    globalThis.Logger.log('info', `[${NAMESPACE}] Getting all Coasters `, { ...globalThis.LoggingParams})

    Coaster.getCoasters(res.locals.userId).then((coasters) => {
        res.send(coasters);
    }).catch((error) => {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Get all Coasters `, { ...globalThis.LoggingParams, error })

        res.status(error.status || 500).send(error)
    })
});

router.get('/:coasterId', (req: Request, res: Response) => {
    const { coasterId } = req.params;
    globalThis.Logger.log('info', `[${NAMESPACE}] Getting Coaster `, { ...globalThis.LoggingParams, coasterId })

    Coaster.getCoastersById(res.locals.userId, coasterId).then((coaster) => {
        res.send(coaster);
    }).catch((error) => {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not Get Coaster (one) `, { ...globalThis.LoggingParams, coasterId, error },)

        res.status(error.status || 500).send(error)
    })
});

router.post('/:coasterId', (req: Request, res: Response) => {
    const { coasterId } = req.params;
    globalThis.Logger.log('info', `[${NAMESPACE}] Adding Coaster `, { ...globalThis.LoggingParams, coasterId })
    Coaster.addCoaster(res.locals.userId, coasterId).then((resp) => {
        res.json(resp)
    }).catch((error) => {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not add Coaster `, { ...globalThis.LoggingParams, coasterId, error })

        res.status(error.status || 500).json(error)
    });
});

router.put('/:coasterId', async (req: Request, res: Response) => {
    const { coasterId } = req.params;
    const { name, active } = req.body;

    try {
        globalThis.Logger.log('info', `[${NAMESPACE}] Updating Coaster `, { ...globalThis.LoggingParams, coasterId, params: { name, active } })

        const resp = await Coaster.updateCoaster(coasterId, name, active);
        res.send(resp);
    } catch (error) {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not update Coaster `, { ...globalThis.LoggingParams, coasterId, error })

        res.status(error.status || 500).send(error);
    }
});

router.delete('/:coasterId', (req: Request, res: Response) => {
    const { coasterId } = req.params;

    globalThis.Logger.log('info', `[${NAMESPACE}] Deleting Coaster `, { ...globalThis.LoggingParams, coasterId })

    Coaster.removeCoaster(res.locals.userId, coasterId).then((resp) => {
        res.json(resp)
    }).catch((error) => {
        globalThis.Logger.log('error', `[${NAMESPACE}] Could not delete Coaster `, { ...globalThis.LoggingParams, coasterId, error })
        
        res.status(error.status || 500).json(error)
    });
});


module.exports = router;