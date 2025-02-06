const express = require('express');
const router = express.Router();
const dbSingleton = require('../database/dbSingleton');
const bcrypt = require('bcrypt');

const db = dbSingleton.getConnection();

router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(query, [name, email, hashedPassword], (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ 
                message: 'User created successfully',
                userId: results.insertId 
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            if (results.length === 0) {
                res.status(401).json({ message: 'User not found' });
                return;
            }

            const user = results[0];
            const isValid = await bcrypt.compare(password, user.password);
            
            if (!isValid) {
                res.status(401).json({ message: 'Invalid password' });
                return;
            }

            res.json({ 
                message: 'Login successful',
                userId: user.id,
                name: user.name,
                email: user.email
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT id, name, email, created_at FROM users WHERE id = ?';
    
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (results.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        
        res.json(results[0]);
    });
});

router.get('/', (req, res) => {
    const query = 'SELECT id, name, email, created_at FROM users';
    
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        
        let query;
        let params;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
            params = [name, email, hashedPassword, id];
        } else {
            query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
            params = [name, email, id];
        }

        db.query(query, params, (err, results) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.json({ message: 'User updated successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    });
});

module.exports = router;