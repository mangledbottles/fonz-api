var express = require('express');
var router = express.Router();
const Host = require("../../controller/host");

// Get session information
router.get('/', (req, res, next) => {
  console.log("GET Get Session Information")
  Host.getSession().then((sessionInfo) => {
    res.status(sessionInfo.status || 200).json(sessionInfo);
  }).catch((err) => {
    console.error(err);
    res.status(err.status || 500).json(err);
  })
});

// Create session
router.post('/', (req, res, next) => {
  console.log("POST Create Session");
  Host.createSession().then((sessionInfo) => {
    res.status(sessionInfo.status || 200).json(sessionInfo);
  }).catch((err) => {
    console.error(err);
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
    sessionId,
  } = req.params;
  const {
    active,
    authenticationId
  } = req.body;
  
  if (!active || !authenticationId) return res.status(400).json({
    status: 400,
    message: 'Missing parameters'
  });
  if (!(active == 'true' || active == 'false')) return res.status(403).json({
    message: "Invalid input"
  })
  Host.updateSession(sessionId, (active == 'true'), authenticationId).then((resp) => {
    res.status(resp.status || 200).json(resp);
  }).catch((err) => {
    res.status(err.status || 500).json(err);
  })
})

module.exports = router;