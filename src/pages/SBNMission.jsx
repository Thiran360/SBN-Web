import { Target } from 'lucide-react';
import '../styles/About.css';

export default function SBNMission() {
  const missionItems = [
    "That empowering entrepreneurs gives meaning and purpose to economic growth",
    "That global business collaboration transcends borders",
    "That innovation and sustainability can best be achieved through shared knowledge",
    "That communities thrive when businesses prioritize social responsibility",
    "That the greatest asset of any enterprise is human potential",
    "And that fostering mutual success is the best work of a professional network"
  ];

  return (
    <div className="about-page-bg">
      <div className="about-content container">
        <div className="about-card">
          <div className="about-grid">
            
            <div className="about-image-column">
              <div className="logo-circle">
                <img src="/images/new-logo.png" alt="Social Business Network Logo" />
              </div>
              <button className="btn-yellow">
                <Target size={18} className="btn-icon" />
                OUR MISSION
              </button>
            </div>
            
            <div className="about-text-column">
              <span className="about-subtitle">Our Purpose</span>
              <h2 className="about-title">SBN Core Values</h2>
              
              <div className="quote-card" style={{ padding: '24px 40px' }}>
                <p><strong>We believe</strong> in driving global economic growth by empowering the next generation of business leaders and innovators.</p>
              </div>
              
              <div className="info-card">
                <ul className="mission-list">
                  {missionItems.map((item, index) => (
                    <li key={index}>
                      <div className="check-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="12" fill="#4361EE" />
                          <path d="M7 12L10.5 15.5L18 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
