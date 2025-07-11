import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, LogOut, Smile, MessageCircle } from 'lucide-react';
import io from 'socket.io-client';
import axios from 'axios';

const Chat = ({ user, token, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const emojis = ['❤️', '💕', '💖', '💗', '💘', '💙', '💚', '💛', '💜', '🧡', '🖤', '🤍', '💯', '💋', '🥰', '😍', '😘', '🥵', '🔥', '✨'];

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setSocket(newSocket);
    });

    newSocket.on('new-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user-typing', (data) => {
      if (data.username !== user.username) {
        setOtherUserTyping(data.isTyping ? data.username : '');
      }
    });

    // Load message history
    loadMessages();

    return () => {
      newSocket.close();
    };
  }, [token, user.username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await axios.get('/api/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      text: newMessage,
      emoji: null
    };

    socket.emit('send-message', messageData);
    setNewMessage('');
    handleStopTyping();
  };

  const handleSendEmoji = (emoji) => {
    if (!socket) return;

    const messageData = {
      text: '',
      emoji: emoji
    };

    socket.emit('send-message', messageData);
    setShowEmojiPicker(false);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping && socket) {
      setIsTyping(true);
      socket.emit('typing', { isTyping: true });
    }

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping && socket) {
      setIsTyping(false);
      socket.emit('typing', { isTyping: false });
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-love-pink/10 via-white to-love-purple/10">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-love-pink to-love-purple p-2 rounded-full">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">💕 Our Chat</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.username}!</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-4xl mx-auto px-4 py-4">
          <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col">
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Start your conversation! 💕</p>
                  <p className="text-gray-400 text-sm mt-2">Send your first message below</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex ${message.sender === user.username ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === user.username
                          ? 'bg-gradient-to-r from-love-pink to-love-purple text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.emoji ? (
                        <div className="text-3xl text-center">{message.emoji}</div>
                      ) : (
                        <p className="break-words">{message.text}</p>
                      )}
                      <p className={`text-xs mt-1 ${
                        message.sender === user.username ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              
              {/* Typing Indicator */}
              {otherUserTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl max-w-xs">
                    <p className="text-gray-600 text-sm mb-1">{otherUserTyping} is typing...</p>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="px-6 py-3 border-t border-gray-200">
                <div className="grid grid-cols-10 gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendEmoji(emoji)}
                      className="p-2 text-2xl hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="p-6 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Smile className="w-6 h-6" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    onBlur={handleStopTyping}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-love-pink focus:border-transparent outline-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-gradient-to-r from-love-pink to-love-purple text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;