import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
const Coaster = require('../controller/Coasters.controller');

router.get('/', (req: Request, res: Response) => {
    Coaster.getCoasters(res.locals.userId).then((coasters) => {
        res.send(coasters);
    }).catch((error) => {
        res.status(error.status || 500).send(error)
    })
});

router.get('/:coasterId', (req: Request, res: Response) => {
    const { coasterId } = req.params;
    Coaster.getCoastersById(res.locals.userId, coasterId).then((coaster) => {
        res.send(coaster);
    }).catch((error) => {
        res.status(error.status || 500).send(error)
    })
});

router.post('/:coasterId', (req: Request, res: Response) => {
    const { coasterId } = req.params;
    Coaster.addCoaster(res.locals.userId, coasterId).then((resp) => {
        res.json(resp)
    }).catch((error) => {
        res.status(error.status || 500).json(error)
    });
});

router.put('/:coasterId', async (req: Request, res: Response) => {
    try {
        const { coasterId } = req.params;
        const { name, active, encoded } = req.body;

        const resp = await Coaster.updateCoaster(coasterId, { name, active, encoded });
        res.send(resp);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).send(error);
    }
});

router.delete('/:coasterId', (req: Request, res: Response) => {
    const { coasterId } = req.params;
    Coaster.removeCoaster(res.locals.userId, coasterId).then((resp) => {
        res.json(resp)
    }).catch((error) => {
        console.error(error);
        res.status(error.status || 500).json(error)
    });
});


module.exports = router;