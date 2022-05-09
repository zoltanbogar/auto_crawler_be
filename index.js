const port = 8080;

const express = require('express');
const app = express();

const cors = require("cors");

const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
        'PUT'
    ],

    allowedHeaders: [
        'Content-Type',
    ],
};

app.use(cors(corsOpts));
app.options('*', cors());

const carRouter = require("./routes/cars");
const financeRouter = require("./routes/finance");

const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: false }))

app.use("/cars", carRouter);
app.use("/finance", financeRouter);

//app.use(express.static(__dirname + '/public'));

//app.listen(port, '192.168.50.136', () => console.log(`Listening on 192.168.50.136:${port}`));
app.listen(port, () => console.log(`Listening on ${port}`));
