import React, { useState } from 'react';
import axios from 'axios';
import ThemeToggle from './ThemeToggle';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--bg-board)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        position: 'absolute',
        top: '24px',
        right: '24px'
      }}>
        <ThemeToggle />
      </div>
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--border-radius)',
        padding: '48px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-color)',
        animation: 'slideUp 0.3s ease'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, var(--accent-primary), #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ✨ Epitrello
          </h1>
          <h2 style={{ 
            marginTop: 0, 
            marginBottom: '8px', 
            fontSize: '24px',
            color: 'var(--text-primary)',
            fontWeight: '600'
          }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ 
            margin: 0, 
            color: 'var(--text-secondary)',
            fontSize: '14px'
          }}>
            {isLogin ? 'Sign in to continue to your workspace' : 'Sign up to get started'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger)',
            color: 'white',
            padding: '14px 18px',
            borderRadius: 'var(--border-radius-sm)',
            marginBottom: '20px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: 'var(--shadow-sm)'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: 'var(--text-primary)',
                fontSize: '14px'
              }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '15px',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  transition: 'all var(--transition-speed) ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: 'var(--text-primary)',
              fontSize: '14px'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '15px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                transition: 'all var(--transition-speed) ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: 'var(--text-primary)',
              fontSize: '14px'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                fontSize: '15px',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                transition: 'all var(--transition-speed) ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {isLogin ? '🚀 Login' : '✨ Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-primary)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all var(--transition-speed) ease',
              padding: '8px'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>

        <div style={{ 
          marginTop: '20px', 
          paddingTop: '20px',
          borderTop: '1px solid var(--border-light)',
          textAlign: 'center' 
        }}>
          <button
            onClick={() => {
              onLogin({ username: 'Guest', email: 'guest@epitrello.com', isGuest: true });
            }}
            style={{
              background: 'var(--bg-hover)',
              border: '2px solid var(--border-color)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '10px 20px',
              borderRadius: 'var(--border-radius-sm)',
              fontWeight: '600',
              transition: 'all var(--transition-speed) ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--bg-tertiary)';
              e.target.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--bg-hover)';
              e.target.style.color = 'var(--text-secondary)';
            }}
          >
            👋 Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
