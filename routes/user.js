const express = require('express');
const router = express.Router();
const dbSingleton = require('../database/dbSingleton');
const bcrypt = require('bcrypt');

const db = dbSingleton.getConnection();

/**
 * Register a new user
 * @route POST /users/register
 */
router.post('/register', async (req, res) => {
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

/**
 * Login user
 * @route POST /users/login
 */
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

            // Set session data
            req.session.userId = user.id;
            req.session.isAdmin = user.role === 'admin';
            req.session.save();

            res.json({ 
                message: 'Login successful',
                userId: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Logout user
 * @route POST /users/logout
 */
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'Could not log out' });
            return;
        }
        res.json({ message: 'Logged out successfully' });
    });
});

/**
 * Get user by ID
 * @route GET /users/:id
 */
router.get('/:id', (req, res) => {
    // Users can only view their own profile unless they're admin
    if (req.params.id != req.session.userId && !req.session.isAdmin) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const query = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
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

/**
 * Get all users (admin only)
 * @route GET /users
 */
router.get('/', (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    const query = 'SELECT id, name, email, role, created_at FROM users';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

/**
 * Update user
 * @route PUT /users/:id
 */
router.put('/:id', async (req, res) => {
    try {
        // Users can only update their own profile unless they're admin
        if (req.params.id != req.session.userId && !req.session.isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const { name, email, password } = req.body;
        
        let query;
        let params;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
            params = [name, email, hashedPassword, req.params.id];
        } else {
            query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
            params = [name, email, req.params.id];
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

/**
 * Delete user (admin only)
 * @route DELETE /users/:id
 */
router.delete('/:id', (req, res) => {
    if (!req.session.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }

    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [req.params.id], (err, results) => {
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