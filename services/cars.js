const db = require('./db');
const helper = require('../helper');
const config = require('../config');

const express = require('express')
const {spawn} = require('child_process');

const axios = require('axios');

const tables = require('./tables/tables');
const carListStructure = require('./structure/car_list')

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT ${carListStructure.columns.join(', ')}
    FROM ${tables.tables.carList}
    WHERE user_deactivated=0 ORDER BY created_at DESC LIMIT ${offset},${config.listPerPage}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = {page};

    return {
        data,
        meta
    }
}

async function getMultipleHighlighted(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT ${carListStructure.columns.join(', ')}
    FROM ${tables.tables.carList}
    WHERE user_deactivated=0
    AND highlighted = 1 ORDER BY updated_at DESC LIMIT ${offset},${config.listPerPage}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = {page};

    return {
        data,
        meta
    }
}

async function getCount() {
    const rows = await db.query(
        `SELECT count(1) as count
    FROM ${tables.tables.carList}`
    );
    const data = helper.oneOrNull(rows);

    return {
        data,
    }
}

async function getHighlightedCount() {
    const rows = await db.query(
        `SELECT count(1) as count
    FROM ${tables.tables.carList}
    WHERE highlighted = 1`
    );
    const data = helper.oneOrNull(rows);

    return {
        data,
    }
}

async function getById(id) {
    const rows = await db.query(
        `SELECT ${carListStructure.columns.join(', ')}
    FROM ${tables.tables.carList}
    WHERE id = ${id}
    LIMIT 1`
    );
    const data = helper.oneOrNull(rows);

    return {
        data
    }
}

async function insertCar(car) {
    //console.log(car);

    //brand_id és type_id kell még
    const date = new Date();
    const createdAt = date.getFullYear() +
        '.' + ('0' + (date.getMonth() + 1)).slice(-2) +
        '.' + ('0' + date.getDate()).slice(-2) +
        " " + ('0' + date.getHours()).slice(-2) +
        ":" + ('0' + date.getMinutes()).slice(-2) +
        ":" + ('0' + date.getSeconds()).slice(-2);

    const res = await db.query(
        `INSERT INTO ${tables.tables.carList} (
ad_id, 
link, 
title, 
description, 
image_url, 
price, 
extra_data, 
distance, 
created_at, 
updated_at
)
    VALUES (
        '${car.id}', 
        '${car.link}', 
        '${car.title}', 
        '${car.description}', 
        '${car.image ? car.image : ""}',
        ${Number(car.price.replace(/[^0-9.-]+/g,""))}, 
        '${car.extraData}', 
        ${car.distance ? car.distance : 0}, 
        "${createdAt}",
        "${createdAt}"
    )`
    );

    return {
        affectedRows: res.affectedRows,
        insertId: res.insertId,
    };
}

async function highlightCar(id, status) {
    const date = new Date();
    const updatedAt = date.getFullYear() +
        '.' + ('0' + (date.getMonth() + 1)).slice(-2) +
        '.' + ('0' + date.getDate()).slice(-2) +
        " " + ('0' + date.getHours()).slice(-2) +
        ":" + ('0' + date.getMinutes()).slice(-2) +
        ":" + ('0' + date.getSeconds()).slice(-2);

    const res = await db.query(
        `UPDATE ${tables.tables.carList}
        SET highlighted=${status ? 1 : 0}, updated_at="${updatedAt}"
        WHERE id = ${id}`
    );

    return {
        affectedRows: res.affectedRows,
        insertId: res.insertId,
    };
}

async function deactivateCar(id) {
    const date = new Date();
    const updatedAt = date.getFullYear() +
        '.' + ('0' + (date.getMonth() + 1)).slice(-2) +
        '.' + ('0' + date.getDate()).slice(-2) +
        " " + ('0' + date.getHours()).slice(-2) +
        ":" + ('0' + date.getMinutes()).slice(-2) +
        ":" + ('0' + date.getSeconds()).slice(-2);

    const res = await db.query(
        `UPDATE ${tables.tables.carList}
        SET user_deactivated=1, updated_at="${updatedAt}"
        WHERE id = ${id}`
    );

    return {
        affectedRows: res.affectedRows,
        insertId: res.insertId,
    };
}

async function getAffordableCars(page = 1){
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT ${carListStructure.columns.join(', ')}
    FROM ${tables.tables.carList}
    WHERE price < (select current_eur * 5000 from finance) ORDER BY created_at DESC LIMIT ${offset},${config.listPerPage}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = {page};

    return {
        data,
        meta
    }
}

async function getAffordableCount() {
    const rows = await db.query(
        `SELECT count(1) as count
    FROM ${tables.tables.carList}
    WHERE price < (select current_eur * 5000 from finance)`
    );
    const data = helper.oneOrNull(rows);

    return {
        data,
    }
}

async function getCarBrands() {
    const rows = await db.query(
        `SELECT *
    FROM car_brand`
    );
    const data = helper.emptyOrRows(rows);

    return {
        data,
    }
}

async function setBrandToCar(brandId, carId) {
    const date = new Date();
    const updatedAt = date.getFullYear() +
        '.' + ('0' + (date.getMonth() + 1)).slice(-2) +
        '.' + ('0' + date.getDate()).slice(-2) +
        " " + ('0' + date.getHours()).slice(-2) +
        ":" + ('0' + date.getMinutes()).slice(-2) +
        ":" + ('0' + date.getSeconds()).slice(-2);

    const res = await db.query(
        `UPDATE ${tables.tables.carList}
        SET brand_id=${brandId}, updated_at="${updatedAt}"
        WHERE id = ${carId}`
    );

    return {
        affectedRows: res.affectedRows,
        insertId: res.insertId,
    };
}

async function getCarTypes(brandId) {
    const rows = await db.query(
        `SELECT *
    FROM car_type where brand_id = ${brandId}`
    );
    const data = helper.emptyOrRows(rows);

    return {
        data,
    }
}

async function setTypeToCar(typeId, carId) {
    const date = new Date();
    const updatedAt = date.getFullYear() +
        '.' + ('0' + (date.getMonth() + 1)).slice(-2) +
        '.' + ('0' + date.getDate()).slice(-2) +
        " " + ('0' + date.getHours()).slice(-2) +
        ":" + ('0' + date.getMinutes()).slice(-2) +
        ":" + ('0' + date.getSeconds()).slice(-2);

    const res = await db.query(
        `UPDATE ${tables.tables.carList}
        SET type_id=${typeId}, updated_at="${updatedAt}"
        WHERE id = ${carId}`
    );

    return {
        affectedRows: res.affectedRows,
        insertId: res.insertId,
    };
}

async function getFilteredCarsCount(query) {
    let conditions = Object.keys(query).map((cond, idx) => {
        if(cond==="priceMin"){
            return ` price > ${query[cond]}`
        }
        if(cond==="priceMax"){
            return ` price < ${query[cond]}`
        }
        if(cond==="dateMin"){
            return ` created_at > "${query[cond]}"`
        }
        if(cond==="dateMax"){
            return ` created_at < "${query[cond]}"`
        }
        if(cond==="brands" && query[cond]){
            return ` brand_id IN (${query[cond]})`
        }
    })

    conditions = conditions.filter(e => e != null);

    let where = '';

    if(conditions){
        where = `WHERE ${conditions.join(" AND")}`;
    }

    const rows = await db.query(
        `SELECT count(1) as count
    FROM ${tables.tables.carList} ${where}`
    );
    const data = helper.oneOrNull(rows);

    return {
        data,
    }
}

async function getFilteredCars(query) {
    let conditions = Object.keys(query).map((cond, idx) => {
        if(cond==="priceMin"){
            return ` price > ${query[cond]}`
        }
        if(cond==="priceMax"){
            return ` price < ${query[cond]}`
        }
        if(cond==="dateMin"){
            return ` created_at > "${query[cond]}"`
        }
        if(cond==="dateMax"){
            return ` created_at < "${query[cond]}"`
        }
        if(cond==="brands" && query[cond]){
            return ` brand_id IN (${query[cond]})`
        }
    })

    conditions = conditions.filter(e => e != null);

    let where = '';

    if(conditions){
        where = `WHERE ${conditions.join(" AND")}`;
    }

    const rows = await db.query(
        `SELECT *
    FROM ${tables.tables.carList} ${where} order by updated_at desc`
    );
    const data = helper.emptyOrRows(rows);

    return {
        data,
    }
}

module.exports = {
    getMultiple,
    getById,
    insertCar,
    getCount,
    highlightCar,
    deactivateCar,
    getMultipleHighlighted,
    getHighlightedCount,
    getAffordableCars,
    getAffordableCount,
    getCarBrands,
    setBrandToCar,
    getCarTypes,
    setTypeToCar,
    getFilteredCarsCount,
    getFilteredCars,
}
