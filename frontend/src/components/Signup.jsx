
import React, { useState } from 'react';
import { UserPlus, User, LockKeyhole, ShieldCheck } from 'lucide-react';

export default function Signup({ onSignup, onShowLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('HR_STAFF');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await onSignup(username, password, confirmPassword, role);
      onShowLogin();
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-icon">
          <UserPlus size={32} />
        </div>

        <h1>CREATE ACCOUNT</h1>
        <p>Register your payroll account</p>

        {error && <div className="auth-error">{error}</div>}

        <label>Username</label>
        <div className="auth-input">
          <User size={18} />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Create username"
            required
          />
        </div>

        <label>Password</label>
        <div className="auth-input">
          <LockKeyhole size={18} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password (minimum 8 characters)"
            required
            minLength={8}
          />
        </div>

        <label>Confirm Password</label>
        <div className="auth-input">
          <LockKeyhole size={18} />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            required
          />
        </div>

        <label>Account Role</label>
        <div className="auth-input">
          <ShieldCheck size={18} />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="HR_STAFF">HR Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button className="auth-submit" disabled={loading}>
          <UserPlus size={18} />
          {loading ? 'Creating account...' : 'SIGN UP'}
        </button>

        <p className="auth-footer">
          Already have an account?{' '}
          <button
            type="button"
            className="auth-link"
            onClick={onShowLogin}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
