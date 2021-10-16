import express, { IRouter, Request, Response } from "express";
var router: IRouter = express.Router();

/** Import controllers */
const Auth = require('../controller/Auth.controller');
const NAMESPACE = "Auth";

// var SpotifyWebApi = require('spotify-web-api-node');
// const User = require('../controller/host');
// const Spotify = require('../controller/spotify');


router.post('/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    globalThis.Logger.log('info', `[${NAMESPACE}] User Login `, { ...globalThis.LoggingParams})

    Auth.signIn(email, password).then((details) => {
      res.send(details);
    }).catch((error) => {
      globalThis.Logger.log('error', `[${NAMESPACE}] Could not Login `, { ...globalThis.LoggingParams, error })

      res.status(error.status || 500).send(error);
    });
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post('/register', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    globalThis.Logger.log('info', `[${NAMESPACE}] User creating account `, { ...globalThis.LoggingParams})

    Auth.signUp(email, password).then((details) => {
      res.send(details);
    }).catch((error) => {
      globalThis.Logger.log('error', `[${NAMESPACE}] Could not register `, { ...globalThis.LoggingParams, error })

      res.status(error.status || 500).send(error);
    });
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
});

router.post('/register/anonymous', async (req: Request, res: Response) => {
  try {
    globalThis.Logger.log('info', `[${NAMESPACE}] User creating Anonymous Account `, { ...globalThis.LoggingParams})

    const account = await Auth.createAnonymousAccount();
    res.send(account);
  } catch (error) {
    globalThis.Logger.log('error', `[${NAMESPACE}] Could not register Anonymous Account `, { ...globalThis.LoggingParams, error })

    res.status(error.status || 500).send(error);
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { userId, refreshToken } = req.body;
    globalThis.Logger.log('info', `[${NAMESPACE}] User Refreshing Token `, { ...globalThis.LoggingParams, userId })


    const account = await Auth.refreshToken(userId, refreshToken);
    res.send(account);
  } catch (error) {
    globalThis.Logger.log('error', `[${NAMESPACE}] Could not Refresh Token `, { ...globalThis.LoggingParams, error })

    res.status(error.status || 500).send(error);
  }
})

module.exports = router;