import '../styles/TopBar.css';

const topBarLinks = [
  { icon: '💛', label: 'SBN Foundation', badge: null },
  { icon: '🛍️', label: 'Purchase Welcome Kits', badge: null },
  { icon: '🎓', label: 'SBN Certifications', badge: 'NEW' },
  { icon: '📍', label: 'Chapter Locator', badge: 'NEW' },
  { icon: '👥', label: 'SBN Alumni Club', badge: null },
];

export default function TopBar() {
  return (
    <div className="top-bar">
      <div className="container top-bar-content">
        {topBarLinks.map((link, index) => (
          <a key={index} href="#" className="top-bar-link">
            <span className="icon">{link.icon}</span>
            {link.label}
            {link.badge && <span className="badge">{link.badge}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}
