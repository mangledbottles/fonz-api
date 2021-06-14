var express = require('express');
var router = express.Router();

const IOS_MINIMUM_APP_VERSION = "1.24";
const ANDROID_MINIMUM_APP_VERSION = "1.0.5";


router.get('/', function(req, res, next) {
  res.status(200).json({ status: 200, message: "Fonzi API Server Active."})
});

router.get('/version', (req, res, next) => {
  const { device } = req.query;
  if(!device) return res.status(400).json({ message: "Invalid device provided"});

  minimumAppVersion = (device == "iOS") ? IOS_MINIMUM_APP_VERSION : ANDROID_MINIMUM_APP_VERSION;

  res.json({
    apiVersion: 1.01,
    minimumAppVersion
  });
})


module.exports = router;
