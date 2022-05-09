const db = require('./db');
const helper = require('../helper');
const config = require('../config');

const axios = require('axios');

async function refreshEurRates() {
    axios.post('http://api.exchangeratesapi.io/v1/latest?access_key=a47cbfcae3c0b9652a09cbb98ce5d821&format=1', {}).then(res => {
        //console.log(res.data.rates.HUF);

        const date = new Date();
        const updatedAt = date.getFullYear() +
            '.' + ('0' + (date.getMonth() + 1)).slice(-2) +
            '.' + ('0' + date.getDate()).slice(-2) +
            " " + ('0' + date.getHours()).slice(-2) +
            ":" + ('0' + date.getMinutes()).slice(-2) +
            ":" + ('0' + date.getSeconds()).slice(-2);

        const result = db.query(
            `UPDATE finance
        SET current_eur=${res.data.rates.HUF}, updated_at="${updatedAt}"`
        );

        return {
            affectedRows: result.affectedRows,
            insertId: result.insertId,
        };
    }).catch(error => {
        console.log(error);
    });
}

async function getEurRates() {
    const rows = await db.query(
        `SELECT current_eur
    FROM finance`
    );
    const data = helper.oneOrNull(rows);

    return {
        data,
    }
}

module.exports = {
    refreshEurRates,
    getEurRates
}
