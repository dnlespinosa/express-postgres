const express = require("express");
const ExpressError = require("../expressError")
const router = express.Router();
const db = require("../db");
const companies = require('./companies')

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({ invoices: results.rows})
    } catch (e) {
        return next(e);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const results = await db.query(`SELECT * FROM invoices WEHERE id=${id}`)
        if (results.rows.length ===0){
            throw new ExpressError(`Cant  find invoice with id of ${id}`, 404)
        } 
        return res.json({invoices: results.rows[0]})
    } catch (e) {
        return next(e)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt, paid, add_date, paid_date } = req.body;
        const results  = await db.query(`INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, $3, $4, $5) RETURNING comp_code, amy, paid, add_date, paid_date`, [comp_code, amt, paid, add_date, paid_date]);
        return res.status(201).json({ invoices: results.rows[0]})
    } catch (e) {
        return next(e)
    }
}) 

router.delete('/:id', async (req, res, next) => {
    try {
        const results = db.query(`DELETE FROM invoices WHERE id=$1`, [req.params.id])
        return res.send({msg: 'deleted'})
    } catch (e) {
        return next(e)
    }
})

module.exports = router