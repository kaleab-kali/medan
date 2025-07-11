const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const { initDatabase } = require('./database/init');
const { authenticateSocket } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Initialize database
initDatabase();

// Socket.IO connection handling
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log(`User ${socket.user.username} connected`);
  
  // Join user to a room (for private messaging)
  socket.join('chat-room');
  
  // Handle new message
  socket.on('send-message', (messageData) => {
    const message = {
      id: Date.now(),
      text: messageData.text,
      sender: socket.user.username,
      timestamp: new Date().toISOString(),
      emoji: messageData.emoji || null
    };
    
    // Save message to database
    const db = require('./database/init').getDatabase();
    const stmt = db.prepare(`
      INSERT INTO messages (text, sender, timestamp, emoji)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(message.text, message.sender, message.timestamp, message.emoji);
    
    // Broadcast to all connected users
    io.to('chat-room').emit('new-message', message);
  });
  
  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.broadcast.to('chat-room').emit('user-typing', {
      username: socket.user.username,
      isTyping: data.isTyping
    });
  });
  
  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`User ${socket.user.username} disconnected`);
    socket.broadcast.to('chat-room').emit('user-typing', {
      username: socket.user.username,
      isTyping: false
    });
  });
});

// Serve React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`💕 Personal Chat Server running on port ${PORT}`);
});