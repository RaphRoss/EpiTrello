const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { pool } = require('../db');

// Simple hash function (in production, use bcrypt)
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Generate simple token (in production, use JWT)
const generateToken = (userId) => {
    return crypto.randomBytes(32).toString('hex') + '-' + userId;
};

// Register new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Insert new user
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [username, email, hashPassword(password)]
        );

        const newUser = result.rows[0];
        const token = generateToken(newUser.id);

        res.status(201).json({
            user: {
                id: newUser.id,
                username: newUser.name,
                email: newUser.email
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        if (!user || user.password !== hashPassword(password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user.id);

        res.json({
            user: {
                id: user.id,
                username: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Get current user (simple token validation)
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const userId = token.split('-')[1];
        
        const result = await pool.query(
            'SELECT id, name, email FROM users WHERE id = $1',
            [userId]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        res.json({
            id: user.id,
            username: user.name,
            email: user.email
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Failed to authenticate' });
    }
});

module.exports = router;
