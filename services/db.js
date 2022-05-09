const mysql = require('mysql2/promise');
const config = require('../config');

//import {createPool, Pool} from 'mysql2/promise';

let globalPool = undefined;

async function query(sql, params) {
   //const connection = await mysql.createConnection(config.db);
    const connection = await connect();
    const [results, ] = await connection.execute(sql, params);

    return results;
}

async function connect() {

    // If the pool was already created, return it instead of creating a new one.
    if(globalPool) {
        return globalPool;
    }

    // If we have gotten this far, the pool doesn't exist, so lets create one.
    globalPool = await mysql.createPool({
        host: "auto-crawler-database-1.czonffh8gwj8.eu-central-1.rds.amazonaws.com",
        user: "admin",
        password: "asddsa123",
        port: "3306",
        database: "auto_crawler",
        connectionLimit: 10
    });
    return globalPool;
}

module.exports = {
    query
}
