import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import '../styles/AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-page">
      {/* Return to Home Link (Positioned absolute to the page) */}
      <div style={{ position: 'absolute', top: '30px', left: '40px', zIndex: 20 }}>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', 
            padding: '8px 12px', cursor: 'pointer', fontSize: '15px', fontWeight: '500', 
            transition: 'all 0.3s ease', textDecoration: 'none'
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateX(-4px)' }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'translateX(0)' }}
        >
          <span style={{ fontSize: '20px', lineHeight: '1' }}>←</span> Back to Home
        </button>
      </div>

      <div className="login-card">
        <h1 className="login-title">Admin Panel</h1>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
}
