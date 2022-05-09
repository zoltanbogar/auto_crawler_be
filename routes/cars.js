const express = require('express');
const router = express.Router();
const cars = require('../services/cars');
const app = express();

const bp = require('body-parser')
const {spawn} = require("child_process");
app.use(bp.json())
app.use(bp.urlencoded({ extended: false }))

/* GET cars */
router.get('/get/:page', async function(req, res, next) {
    try {
        res.json(await cars.getMultiple(req.params.page));
    } catch (err) {
        console.error(`Error while getting cars `, err.message);
        next(err);
    }
});

/* GET cars */
router.get('/count', async function(req, res, next) {
    try {
        res.json(await cars.getCount());
    } catch (err) {
        console.error(`Error while getting cars `, err.message);
        next(err);
    }
});

/* GET cars */
router.get('/get-highlighted/:page', async function(req, res, next) {
    try {
        res.json(await cars.getMultipleHighlighted(req.params.page));
    } catch (err) {
        console.error(`Error while getting cars `, err.message);
        next(err);
    }
});

/* GET cars */
router.get('/count-highlighted', async function(req, res, next) {
    try {
        res.json(await cars.getHighlightedCount());
    } catch (err) {
        console.error(`Error while getting cars `, err.message);
        next(err);
    }
});

/* GET car by id */
router.get('/get-car/:id', async function(req, res, next) {
    const carId = parseInt(req.params.id);
    try {
        res.json(await cars.getById(carId));
    } catch (err) {
        console.error(`Error while getting cars `, err.message);
        next(err);
    }
});

router.put('/add-car', async function(req, res, next) {
    const body = req.body;
    try {
        res.json(await cars.insertCar(body.car));
    } catch (err) {
        console.error(`Error while inserting car `, err.message);
        next(err);
    }
});

router.post('/highlight/:id', async function(req, res, next) {
    const body = req.body;
    try {
        res.json(await cars.highlightCar(req.params.id, body.status));
    } catch (err) {
        console.error(`Error while inserting car `, err.message);
        next(err);
    }
});

router.post('/deactivate/:id', async function(req, res, next) {
    try {
        res.json(await cars.deactivateCar(req.params.id));
    } catch (err) {
        console.error(`Error while inserting car `, err.message);
        next(err);
    }
});

router.post('/send', async function(req, res, next) {
    const body = req.body;

    try {
        const accountSid = 'AC74dcf5dc34732dc700d4901f7d33a5a0'
        const authToken = '2e372eb3dc3c77537daa798fd0f78aed'
        const client = require('twilio')(accountSid, authToken);

        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                //from: 'whatsapp:+36304787501',
                body: `${body.text}: \n ${body.link}`,
                //to: 'whatsapp:+36304787501'
                to: 'whatsapp:+36302233794'
            })
            .then(message => console.log(message.sid));

        res.json("sent");
    } catch (err) {
        console.error(`Error while sending message `, err.message);
        next(err);
    }
});

router.get('/get-affordable/:page', async function(req, res, next) {
    try {
        res.json(await cars.getAffordableCars(req.params.page));
    } catch (err) {
        console.error(`Error while getting affordable cars `, err.message);
        next(err);
    }
});

router.get('/count-affordable', async function(req, res, next) {
    try {
        res.json(await cars.getAffordableCount());
    } catch (err) {
        console.error(`Error while getting affordable cars count `, err.message);
        next(err);
    }
});

router.get('/brands', async function(req, res, next) {
    try {
        res.json(await cars.getCarBrands());
    } catch (err) {
        console.error(`Error while getting affordable car brands `, err.message);
        next(err);
    }
});

router.post('/set-brand-to-car', async function(req, res, next) {
    const body = req.body;
    try {
        res.json(await cars.setBrandToCar(body.brandId, body.carId));
    } catch (err) {
        console.error(`Error while inserting car `, err.message);
        next(err);
    }
});

router.get('/types/:brandId', async function(req, res, next) {
    try {
        res.json(await cars.getCarTypes(req.params.brandId));
    } catch (err) {
        console.error(`Error while getting affordable car brands `, err.message);
        next(err);
    }
});

router.post('/set-type-to-car', async function(req, res, next) {
    const body = req.body;
    try {
        res.json(await cars.setTypeToCar(body.typeId, body.carId));
    } catch (err) {
        console.error(`Error while inserting car `, err.message);
        next(err);
    }
});

router.get('/get-filtered-count', async function(req, res, next) {
    //const body = req.body;
    //console.log(req.query, req.query.priceMin);
    try {
        res.json(await cars.getFilteredCarsCount(req.query));
    } catch (err) {
        console.error(`Error while getting filtered car count `, err.message);
        next(err);
    }
});

router.get('/get-filtered-cars', async function(req, res, next) {
    //const body = req.body;
    //console.log(req.query, req.query.priceMin);
    try {
        res.json(await cars.getFilteredCars(req.query));
    } catch (err) {
        console.error(`Error while getting filtered cars `, err.message);
        next(err);
    }
});

module.exports = router;
