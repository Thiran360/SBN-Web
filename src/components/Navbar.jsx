import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Bell, ChevronDown, Menu, X } from 'lucide-react';
import '../styles/Navbar.css';

const navItems = [
  { label: 'Home', href: '/', hasDropdown: false },
  {
    label: 'About Us',
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { label: 'About SBN', href: '/about-sbn' },
      { label: 'Message from the Founder', href: '/president-message' },
      { label: 'SBN Mission & Values', href: '/sbn-mission' }
    ]
  },
  { label: 'Major Event', href: '/major-events', hasDropdown: false },
  {
    label: 'Join Us',
    href: '#',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Benefits for Members', href: '/benefits-for-members' },
      { label: 'Join SBN', href: '/join-sbn' }
    ]
  },
  { label: 'Check your Membership', href: '/check-membership', hasDropdown: false },
  { label: 'Contact us', href: '/contact-us', hasDropdown: false },
  { label: 'Member Login', href: '/member-login', hasDropdown: false },
  {
    label: 'My Tables',
    href: '/my-tables',
    hasDropdown: true,
    memberOnly: true,
    dropdownItems: [
      { label: 'My Tables', href: '/my-tables' },
      { label: 'Connect', href: '/connect' },
      { label: 'G-Note', href: '/gnote' },
    ]
  },
  { label: 'Admin', href: '/admin', hasDropdown: false },

];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { siteData, updateSiteData } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const [isMember, setIsMember] = useState(false);
  const [memberProfile, setMemberProfile] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const profileRef = useRef(null);

  // Scroll hide/show logic
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if at top
      if (currentScrollY <= 10) {
        setIsAtTop(true);
        setIsVisible(true);
      } else {
        setIsAtTop(false);
        if (currentScrollY > lastScrollY.current) {
          setIsVisible(false); // scrolling down
        } else {
          setIsVisible(true); // scrolling up
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('sbn_member_auth');
      setIsMember(auth === 'true');
      if (auth === 'true') {
        const profile = localStorage.getItem('sbn_member_profile');
        if (profile) setMemberProfile(JSON.parse(profile));
      }
    };
    checkAuth();
    window.addEventListener('memberAuthChanged', checkAuth);
    return () => window.removeEventListener('memberAuthChanged', checkAuth);
  }, []);

  const notifications = siteData.memberNotifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    updateSiteData('memberNotifications', updated);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null); // Close dropdowns when menu toggles
  };

  const toggleDropdown = (index) => {
    if (window.innerWidth <= 968) {
      setActiveDropdown(activeDropdown === index ? null : index);
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  return (
    <>
      <nav className={`navbar ${isVisible ? 'navbar-visible' : 'navbar-hidden'} ${isAtTop ? 'navbar-at-top' : ''}`}>
        <div className="container nav-content">
          <div className="logo">
            <Link to="/" className="logo-wrapper">
              <img src="/images/new-logo.png" alt="Social Business Network Logo" className="logo-img" />
            </Link>
          </div>

          <div className={`nav-links-wrapper ${isMobileMenuOpen ? 'nav-active' : ''}`}>
            <ul className="nav-links">
              {navItems.filter(item => {
                if (isMember && item.label === 'Member Login') return false;
                if (isMember && item.label === 'Admin') return false;
                if (!isMember && item.memberOnly) return false;
                return true;
              }).map((item, index) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={index} className={`${item.hasDropdown ? 'has-dropdown' : ''} ${activeDropdown === index ? 'dropdown-active' : ''}`}>
                    <Link
                      to={item.href}
                      className={isActive ? 'active' : ''}
                      onClick={(e) => {
                        if (item.hasDropdown && window.innerWidth <= 968) {
                          e.preventDefault();
                          toggleDropdown(index);
                        }
                      }}
                    >
                      {item.label}
                      {item.hasDropdown && <ChevronDown size={14} className="chevron" style={{ marginLeft: '4px' }} />}
                    </Link>
                    {item.hasDropdown && item.dropdownItems && (
                      <ul className="dropdown">
                        {item.dropdownItems.map((dropItem, dIndex) => (
                          <li key={dIndex}>
                            <Link to={dropItem.href}>{dropItem.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="nav-right-actions">
            {/* Notification Bell */}
            <div className="notification-container" ref={notificationRef}>
              <button className="notification-bell" onClick={toggleNotifications} aria-label="Notifications">
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                  </div>
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="notification-empty">No new notifications</div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`notification-item ${!notification.read ? 'unread' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="notification-item-header">
                            <h4>{notification.title}</h4>
                            <span className="notification-date">{notification.date}</span>
                          </div>
                          <p>{notification.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Member Profile */}
            {isMember && memberProfile && (
              <div className="profile-container" ref={profileRef} style={{ position: 'relative', marginLeft: '15px' }}>
                <button
                  className="profile-btn"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }}
                >
                  <img src={memberProfile.image} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-color)' }} />
                </button>

                {showProfileDropdown && (
                  <div className="profile-dropdown" style={{ position: 'absolute', top: '100%', right: 0, background: 'var(--bg-card, #fff)', borderRadius: '8px', padding: '8px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '160px', marginTop: '10px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '4px' }}>
                      <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-primary)' }}>{memberProfile.name}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Member</span>
                    </div>
                    <button onClick={() => { setShowProfileDropdown(false); setIsEditProfileModalOpen(true); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '14px' }}>Edit Profile</button>
                    <button onClick={() => {
                      localStorage.removeItem('sbn_member_auth');
                      setIsMember(false);
                      setShowProfileDropdown(false);
                      window.dispatchEvent(new Event('memberAuthChanged'));
                      navigate('/');
                    }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#e53935', fontSize: '14px' }}>Logout</button>
                  </div>
                )}
              </div>
            )}

            <button
              className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
              aria-label="Menu"
              onClick={toggleMobileMenu}
              style={{ background: 'none', border: 'none', color: 'var(--text-dark)' }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      {/* Edit Profile Modal */}
      {isEditProfileModalOpen && memberProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg-card, #fff)', padding: '24px', borderRadius: '12px', width: '400px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--text-primary)', fontSize: '20px' }}>Edit Profile</h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Name</label>
              <input type="text" defaultValue={memberProfile.name} id="edit-profile-name" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Profile Image URL</label>
              <input type="text" defaultValue={memberProfile.image} id="edit-profile-image" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setIsEditProfileModalOpen(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
              <button onClick={() => {
                const newName = document.getElementById('edit-profile-name').value;
                const newImage = document.getElementById('edit-profile-image').value;
                const updatedProfile = { name: newName, image: newImage };
                localStorage.setItem('sbn_member_profile', JSON.stringify(updatedProfile));
                setMemberProfile(updatedProfile);
                setIsEditProfileModalOpen(false);
                window.dispatchEvent(new Event('memberAuthChanged'));
              }} style={{ padding: '8px 16px', background: 'var(--primary-color, #0D8ABC)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
