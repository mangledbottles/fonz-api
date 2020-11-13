var express = require('express');
var router = express.Router();
const Coaster = require('../../controller/coasters/coasters');

router.get('/', (req, res, next) => {
    Coaster.getAllCoasters().then((coasters) => {
        res.json({
            quantity: coasters.length,
            coasters
        })
    }).catch((error) => {
        res.status(error.status || 500).json(error)
    })
})

router.get('/:coasterId', (req, res, next) => {
    const { coasterId } = req.params;
    Coaster.getCoaster(coasterId).then((resp) => {
        res.json(resp)
    }).catch((error) => {
        res.status(error.status || 500).json(error)
    });
});

router.post('/:coasterId', (req, res, next) => {
    const { coasterId } = req.params;
    Coaster.addCoasterToAccount(coasterId).then((resp) => {
        res.json(resp)
    }).catch((error) => {
        res.status(error.status || 500).json(error)
    });
});

router.put('/:coasterId', (req, res, next) => {
    const { coasterId } = req.params;
    console.log("request body", req.body)
    Coaster.updateCoaster(coasterId, req.body).then((resp) => {
        res.json(resp)
    }).catch((error) => {
        console.error(error)
        res.status(error.status || 500).json(error)
    });
});

router.delete('/:coasterId', (req, res, next) => {
    const { coasterId } = req.params;
    Coaster.removeCoaster(coasterId).then((resp) => {
        res.json(resp)
    }).catch((error) => {
        console.error(error);
        res.status(error.status || 500).json(error)
    });
});


module.exports = router;