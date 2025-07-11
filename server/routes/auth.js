const express = require('express');
const bcrypt = require('bcryptjs');
const { getDatabase } = require('../database/init');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters' });
    }

    const db = getDatabase();
    
    // Check if user already exists
    db.get('SELECT id FROM users WHERE username = ?', [username], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (row) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
      stmt.run(username, hashedPassword, function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create user' });
        }

        const user = { id: this.lastID, username };
        const token = generateToken(user);

        res.status(201).json({
          message: 'User created successfully',
          token,
          user: { id: user.id, username: user.username }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const db = getDatabase();
    
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = generateToken({ id: user.id, username: user.username });

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, username: user.username, avatar: user.avatar }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;