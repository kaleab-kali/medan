# 💕 Personal Chat App

A beautiful, modern full-stack chat application designed for couples - your own private social media! Built with React, Node.js, Socket.IO, and SQLite.

## ✨ Features

- **Real-time messaging** with Socket.IO
- **User authentication** (login/signup)
- **Beautiful, modern UI** with Tailwind CSS
- **Emoji support** with quick emoji picker
- **Typing indicators** to see when your partner is typing
- **Message history** stored in SQLite database
- **Responsive design** - works on desktop and mobile
- **Private & secure** - just for you and your partner

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (or you're already in it!)

2. **Install dependencies for both backend and frontend:**
   ```bash
   npm run install-all
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and change the JWT_SECRET to a secure random string.

4. **Start the application:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔧 Usage

1. **Sign up**: Create accounts for both you and your partner
2. **Login**: Use your credentials to access the chat
3. **Start chatting**: Send messages, emojis, and enjoy real-time communication!

## 📱 Features Guide

- **Send Messages**: Type and press Enter or click the send button
- **Send Emojis**: Click the smile icon to open emoji picker
- **Typing Indicators**: See when your partner is typing
- **Message History**: All messages are saved and loaded when you login
- **Logout**: Click the logout button in the top right

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **Socket.IO** - Real-time communication
- **SQLite** - Database (file-based, no setup required)
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
personal-chat-app/
├── server/                 # Backend code
│   ├── database/          # Database initialization
│   ├── middleware/        # Authentication middleware
│   ├── routes/           # API routes
│   └── index.js          # Main server file
├── client/               # Frontend React app
│   ├── public/          # Static files
│   ├── src/             # React components and code
│   └── package.json     # Frontend dependencies
├── package.json         # Backend dependencies & scripts
└── README.md           # This file
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

## 🔒 Security Features

- Passwords are hashed with bcrypt
- JWT tokens for secure authentication
- Protected API routes
- Input validation and sanitization

## 💡 Customization Ideas

- Add photo/file sharing
- Add voice messages
- Add video calling
- Add themes/customization
- Add message reactions
- Add push notifications

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**: Change ports in package.json scripts
2. **Database issues**: Delete `server/database.sqlite` to reset
3. **Connection issues**: Make sure both frontend and backend are running

### Reset Database
```bash
rm server/database.sqlite
# Restart the server to recreate tables
```

## 💝 Made with Love

This app is designed to help couples stay connected with their own private, beautiful chat experience. Enjoy your conversations! 💕

---

**Happy Chatting!** 🥰
