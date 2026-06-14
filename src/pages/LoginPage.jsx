import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LearningContext } from '../context/LearningContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import './AuthPage.css'; // Shared CSS for login/register

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const { triggerConfetti } = useContext(LearningContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        await login(data.token, data.user);
        triggerConfetti();
        navigate('/');
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (err) {
      setError('Failed to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Link to="/" className="back-link">← Back to Home</Link>
      <div className="auth-split fade-in">
        <div className="auth-illustration">
          <h1>Master Your Career</h1>
          <p>Join the most comprehensive learning platform. Build your skills, track your progress, and get placed in top companies.</p>
        </div>
      
        <div className="auth-form-section">
          <div className="auth-container">
            <div className="auth-card">
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Enter your credentials to access your account</p>
            </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <span className="loader-spin"></span> : <><LogIn size={18} /> Login</>}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
