import React, { useState } from 'react';
import { Truck, User, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'munik' && password === 'munik@123') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '2px solid rgba(15, 23, 42, 0.08)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            padding: '8px'
          }}>
            <img src="/logo.png" alt="SVAT Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label className="login-label">Username</label>
            <div className="input-icon-wrapper">
              <User className="login-input-icon" />
              <input 
                type="text" 
                className="login-input" 
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label className="login-label">Password</label>
            <div className="input-icon-wrapper">
              <Lock className="login-input-icon" />
              <input 
                type="password" 
                className="login-input" 
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary login-btn">
            Sign In
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="login-helper">
          <p>Demo Account Credentials:</p>
          <p>User: <span>munik</span> | Pass: <span>munik@123</span></p>
        </div>
      </div>
    </div>
  );
}
