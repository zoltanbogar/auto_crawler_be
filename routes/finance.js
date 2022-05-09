const express = require('express');
const router = express.Router();
const finance = require('../services/finance');
const app = express();

const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: false }))

router.get('/refresh', async function(req, res, next) {
    try {
        res.json(await finance.refreshEurRates());
    } catch (err) {
        console.error(`Error while getting cars `, err.message);
        next(err);
    }
});

router.get('/get', async function(req, res, next) {
    try {
        res.json(await finance.getEurRates());
    } catch (err) {
        console.error(`Error while getting cars `, err.message);
        next(err);
    }
});

module.exports = router;
