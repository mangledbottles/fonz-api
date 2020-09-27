var express = require('express');
var router = express.Router();
const Host = require("../../controller/host");


// Create session
router.post('/', async (req, res, next) => {
  Host.createSession().then((sessionInfo) => {
    res.status(sessionInfo.status || 200).json(sessionInfo);
  }).catch((err) => {
    res.status(err.status || 500).json(err);
  })
});

// Get session information
router.get('/', (req, res, next) => {
  Host.getSession().then((sessionInfo) => {
    res.status(sessionInfo.status || 200).json(sessionInfo);
  }).catch((err) => {
    res.status(err.status || 500).json(err);
  })
});

// Delete session
router.delete('/:sessionId', (req, res, next) => {
  const {
    sessionId
  } = req.params;
  // if(!sessionId) return res.status(400).json({ message: "Session ID missing"})
  Host.deleteSession(sessionId).then(() => {
    res.status(204).json({})
  }).catch((error) => {
    res.status(error.status || 500).json(error);
  })
});

// Update session
router.put('/:sessionId', (req, res, next) => {
  const {
    sessionId
  } = req.params;
  const {
    active
  } = req.body;
  if (!active) return res.status(400).json({
    status: 400,
    message: 'Missing parameter active'
  });
  if (!(active == 'true' || active == 'false')) return res.status(403).json({
    message: "Invalid input"
  })
  Host.updateSession(sessionId, active).then((resp) => {
    res.status(resp.status || 200).json(resp);
  }).catch((err) => {
    res.status(err.status || 500).json(err);
  })
})

module.exports = router;