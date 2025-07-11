import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Chat from './components/Chat';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for saved authentication
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-love-pink/20 via-white to-love-purple/20">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? 
                <Navigate to="/chat" replace /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/chat" 
            element={
              user ? 
                <Chat user={user} token={token} onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/chat" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;