const express = require('express');
const router = express.Router();
const dbSingleton = require('../database/dbSingleton');

const db = dbSingleton.getConnection();

router.post('/', (req, res) => {
    const { name, price } = req.body;
    const query = 'INSERT INTO products (name, price) VALUES (?, ?)';
    db.query(query, [name, price], (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ message: 'Product added!', id: results.insertId });
    });
});

router.get('/', (req, res, next) => {
    try {
        const { limit } = req.query;

        if (limit && isNaN(limit)) {
            return res.status(400).json({ error: 'Parameter "limit" must be a number' });
        }

        const query = limit
            ? 'SELECT * FROM products LIMIT ?'
            : 'SELECT * FROM products';
        
        const params = limit ? [parseInt(limit, 10)] : [];
       
        db.query(query, params, (err, results) => {
            if (err) {
                return next(err);
            }
            res.json(results);
        });
    } catch (error) {
        next(error);
    }
});       

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        res.json(results[0]);
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    const query = 'UPDATE products SET name = ?, price = ? WHERE id = ?';
    db.query(query, [name, price, id], (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ message: 'Product updated!' });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ message: 'Product deleted!' });
    });
});

module.exports = router;