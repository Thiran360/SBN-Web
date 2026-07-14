import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import '../styles/MembersLogin.css';

export default function MembersLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both mobile number and password.');
      return;
    }

    setLoading(true);

    try {
      const u = username.trim();
      const p = password.trim();

      console.log('Real login attempt with:', { mobile: u, password: p });

      let memberName = 'Member User';
      let memberId = null;
      let memberBusiness = '';

      // Hit backend login endpoint via localhost to trigger Vite proxy and bypass CORS
      const response = await fetch('https://api.codingboss.in/crm/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ username: u, mobile: u, password: p })
      });

      if (!response.ok) {
        throw new Error('Invalid mobile number or password.');
      }

      const data = await response.json();
      console.log("Login Response from server:", data); // Helpful for debugging backend structure
      
      // Extract member details (Handles different possible backend structures)
      const userData = data.user || data.data || data;
      if (userData) {
        memberName = userData.name || userData.full_name || userData.first_name || 'Member User';
        memberId = userData.id || userData.member_id || null;
        memberBusiness = userData.business_name || userData.company_name || '';
      }

      // On success
      localStorage.setItem('sbn_member_auth', 'true');
      localStorage.removeItem('sbn_admin_auth');

      localStorage.setItem('sbn_member_profile', JSON.stringify({
        name: memberName,
        mobile: username.trim(),
        member_id: memberId,
        business_name: memberBusiness,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=0D8ABC&color=fff`
      }));

      // Dispatch custom event so Navbar can update without reload
      window.dispatchEvent(new Event('memberAuthChanged'));
      navigate('/');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your username first to reset your password.');
    } else {
      setError('');
      alert(`A password reset link has been sent to the email associated with the username: ${username}`);
    }
  };

  return (
    <div className="ml-page">
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

      <div className="ml-overlay"></div>

      <div className="ml-form-container">

        <div className="ml-form-card">

          {/* Brand Header */}
          <div className="ml-brand-header">
            <img src="/images/new-logo.png" alt="SBN Logo" className="ml-logo" />
            <div className="ml-form-badge">MEMBERS PORTAL</div>
          </div>

          <div className="ml-form-header">
            <h1 className="ml-form-title">Welcome Back</h1>
            <p className="ml-form-subtitle">Sign in to access your secure account</p>
          </div>

          {/* Form */}
          <form className="ml-form" onSubmit={handleSubmit}>

            <div className="ml-field">
              <label htmlFor="ml-username">Mobile Number</label>
              <div className="ml-input-wrap">
                <span className="ml-input-icon">
                  <Phone size={18} strokeWidth={2} />
                </span>
                <input
                  id="ml-username"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="ml-field">
              <div className="ml-label-row">
                <label htmlFor="ml-password">Password</label>
                <a href="#" className="ml-forgot" onClick={handleForgotPassword}>Forgot password?</a>
              </div>
              <div className="ml-input-wrap">
                <span className="ml-input-icon">
                  <Lock size={18} strokeWidth={2} />
                </span>
                <input
                  id="ml-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="ml-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="ml-error">
                <AlertCircle size={16} strokeWidth={2.5} />
                {error}
              </div>
            )}

            <button type="submit" className="ml-btn-login" disabled={loading}>
              {loading ? (
                <span className="ml-spinner" />
              ) : (
                <LogIn size={16} strokeWidth={2.5} />
              )}
              {loading ? 'Authenticating…' : 'Sign In'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
