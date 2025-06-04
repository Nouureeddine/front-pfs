import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './scenes/Auth/Login';
import Signup from './scenes/Auth/Signup';
import Dashboard from './scenes/Dashboard/Dashboard';
import './App.css';

function AuthWrapper({ onLogin, onSignupSuccess, user }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToSignup = () => setIsLogin(false);
  const handleSwitchToLogin = () => setIsLogin(true);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return isLogin ? (
    <Login onSwitchToSignup={handleSwitchToSignup} onLogin={onLogin} />
  ) : (
    <Signup onSwitchToLogin={handleSwitchToLogin} onSignupSuccess={onSignupSuccess} />
  );
}

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<AuthWrapper onLogin={handleLogin} onSignupSuccess={handleSignupSuccess} user={user} />}
      />
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard user={user} onLogout={() => setUser(null)} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default App;
