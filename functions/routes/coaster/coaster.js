var express = require('express');
var router = express.Router();

router.get('/:coasterId', (req, res, next) => {
    const { coasterId } = req.params;
    coasterId.getCoaster(coasterId).then((resp) => {
        res.json(resp)
    }).catch((error) => {
        res.status(error.status || 500).json(error)
    });
});

router.post('/:coasterId', (req, res, next) => {
    const { coasterId } = req.params;
    coasterId.addCoasterToAccount(coasterId).then((resp) => {
        res.json(resp)
    }).catch((error) => {
        res.status(error.status || 500).json(error)
    });
});

router.put('/:coasterId', (req, res, next) => {
    const { coasterId } = req.params;
    // const { paused, name } = req.body;
    coasterId.updateCoaster(coasterId, req.body).then((resp) => {
        res.json(resp)
    }).catch((error) => {
        res.status(error.status || 500).json(error)
    });
});

router.delete('/:coasterId', (req, res, next) => {
    const { coasterId } = req.params;
    coasterId.removeCoaster(coasterId).then((resp) => {
        res.json(resp)
    }).catch((error) => {
        res.status(error.status || 500).json(error)
    });
});


module.exports = router;