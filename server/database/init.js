const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

const initDatabase = () => {
  const dbPath = path.join(__dirname, '../database.sqlite');
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('💾 Connected to SQLite database');
      createTables();
    }
  });
};

const createTables = () => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT DEFAULT '💕',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    }
  });

  // Messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      sender TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      emoji TEXT,
      FOREIGN KEY (sender) REFERENCES users (username)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating messages table:', err.message);
    }
  });
};

const getDatabase = () => {
  return db;
};

module.exports = {
  initDatabase,
  getDatabase
};