const express = require('express');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all messages (chat history)
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    
    db.all(`
      SELECT * FROM messages 
      ORDER BY timestamp ASC 
      LIMIT 100
    `, [], (err, messages) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ messages });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a message (optional feature)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    
    // Check if message belongs to the user
    db.get('SELECT * FROM messages WHERE id = ? AND sender = ?', 
      [id, req.user.username], (err, message) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!message) {
        return res.status(404).json({ error: 'Message not found or unauthorized' });
      }

      // Delete the message
      db.run('DELETE FROM messages WHERE id = ?', [id], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete message' });
        }

        res.json({ message: 'Message deleted successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;