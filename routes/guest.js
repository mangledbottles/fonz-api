var express = require('express');
var router = express.Router();
const SpotifyGuestRouter = require('./guest/spotify');
const Session = require('../controller/Sessions/sessions')

async function ValidSession(req, res, next) {
    try {
        const {
            sessionId
        } = req.params;
        console.log({
            sessionId
        })
        const session = await global.SessionsDB
            .doc(sessionId)
            .get();
        if (!session.exists) return res.status(404).json({
            status: 404,
            message: `Session ID ${sessionId} does not exist.`
        })
        const {
            active,
            provider,
            userId: hostUserId,
            authenticationId
        } = session.data();
    
        global.session = {
            name: 'Fonz User',
            active,
            provider,
            hostUserId,
            authenticationId,
            sessionId
        }
        next();
    } catch (error) {
        throw (error)
    }
}

/* Get details of session from a coaster UID */
router.get('/coaster/:coasterUID', async (req, res) => {
    try {
        const {
            coasterUID
        } = req.params;
        const session = await Session.getCoasterSession(coasterUID);
        res.json(session)
    } catch (error) {
        res.json(error);
        console.error(error);
    }
})

router.get('/session/:sessionId', ValidSession, async (req, res, next) => {
    try {
        const {
            sessionId
        } = req.params;
        const {
            name,
            active,
            provider,
            hostUserId
        } = global.session;

        // TODO: write code to add user to party    
        res.json({
            message: `You have joined ${name}'s Fonz Streaming Party!`,
            sessionId,
            hostUserId,
            provider,
            active
        })
    } catch (error) {
        res.status(500).json(error)
    }

})

router.use('/:sessionId/spotify', ValidSession, SpotifyGuestRouter);

module.exports = router;