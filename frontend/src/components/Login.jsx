
import React, { useState } from 'react';
import { LockKeyhole, User, LogIn } from 'lucide-react';

export default function Login({ onLogin, onShowSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-icon">
          <LockKeyhole size={32} />
        </div>

        <h1>BUILDCORE PAYROLL</h1>
        <p>Please sign in to continue</p>

        {error && <div className="auth-error">{error}</div>}

        <label>Username</label>
        <div className="auth-input">
          <User size={18} />
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <label>Password</label>
        <div className="auth-input">
          <LockKeyhole size={18} />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="auth-submit" disabled={loading}>
          <LogIn size={18} />
          {loading ? 'Signing in...' : 'LOGIN'}
        </button>

        <p className="auth-footer">
          Don't have an account?{' '}
          <button
            type="button"
            className="auth-link"
            onClick={onShowSignup}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}
