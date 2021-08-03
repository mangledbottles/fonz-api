import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
const User = require('../controller/User.controller');

router.put('/', async (req: Request, res: Response) => {
    try {
        const { displayName, email, password, agreedMarketing, agreedConsent } = req.body;
        const user = await User.updateAccount(email, displayName, password, agreedMarketing, agreedConsent);
        res.send(user);
    } catch(error) {
        console.error(error);
        res.status(error.status || 500).send(error);
    }
})

        res.send(user);
    } catch(error) {
        console.error(error);
        res.status(error.status || 500).send(error);
    }
})

module.exports = router;