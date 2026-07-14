import { Link } from 'react-router-dom';
import { Network, Landmark, Map, TrendingUp, FileText } from 'lucide-react';
import '../styles/About.css';

export default function AboutSBN() {
  return (
    <div className="about-page-bg">
      <div className="about-content container">
        <div className="about-card">
          <div className="about-grid">
            
            <div className="about-image-column">
              <div className="logo-circle">
                <img src="/images/new-logo.png" alt="Social Business Network Logo" />
              </div>
              <Link to="/join-sbn" className="btn-yellow" style={{ textDecoration: 'none' }}>
                <FileText size={18} className="btn-icon" />
                BECOME A MEMBER
              </Link>
            </div>
            
            <div className="about-text-column">
              <h2 className="about-title">ABOUT SBN</h2>
              
              <div className="info-card">
                <p>
                  Social Business Network (SBN) is a premier global community of <strong>entrepreneurs, professionals, and industry leaders</strong> who share the belief that in order to create positive change and drive innovation, collaboration is key. By engaging in networking, mentorship, and international partnerships, members demonstrate their commitment to professional growth and business excellence.
                </p>
                <div className="icon-bottom-right">
                  <Network size={20} />
                </div>
              </div>
              
              <div className="quote-card">
                <span className="quote-mark left">“</span>
                <p>With thousands of active business chapters globally, SBN forms a vibrant community of innovative professionals dedicated to mutual success.</p>
                <span className="quote-mark right">”</span>
              </div>
              
              <div className="info-card">
                <div className="icon-row-top">
                  <Landmark size={24} />
                  <Map size={24} />
                  <TrendingUp size={24} />
                </div>
                <p>
                  All members belong to an SBN Local Chapter where they focus on building partnerships and finding solutions to scale their ventures. Local Chapters are affiliated with National and Global Hubs, connecting members on an international scale. This <strong>structure links SBN members</strong> together to form a powerful grassroots movement creating global business action.
                </p>
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
