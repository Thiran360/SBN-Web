import { User } from 'lucide-react';
import '../styles/About.css';

export default function PresidentMessagePage() {
  return (
    <div className="about-page-bg">
      <div className="about-content container">
        <div className="about-card">
          <div className="about-grid">
            
            <div className="about-image-column">
              <div className="logo-circle">
                <img src="/images/new-logo.png" alt="SBN Founder" />
              </div>
              <div className="president-signature">
                <p>Yours in Partnership,</p>
                <p><strong>SBN Founder</strong></p>
                <p>President, Social Business Network</p>
              </div>
              <button className="btn-yellow" style={{ marginTop: '10px' }}>
                <User size={18} className="btn-icon" />
                FOUNDER'S MESSAGE
              </button>
            </div>
            
            <div className="about-text-column">
              <span className="about-subtitle">Our Founder & President</span>
              <h2 className="about-title">SBN Leadership</h2>
              
              <div className="info-card">
                <p>Dear Members of the Social Business Network,</p>
                <p>
                  It is a great pleasure to share my thoughts with all of you as we begin this new journey together. This year is going to be an incredible time for our organization. As your President, I want us to focus on making this "The Year of Global Partnerships". This is our time to upgrade our standards, change how we do business, and show the world the true power of the Social Business Network.
                </p>
              </div>
              
              <div className="quote-card">
                <span className="quote-mark left">“</span>
                <p>Let us LEAD with Purpose, CONNECT with industry, and INSPIRE for economic growth.</p>
                <span className="quote-mark right">”</span>
              </div>
              
              <div className="info-card">
                <p>
                  To keep our organization strong and vibrant, I encourage every one of you to bring in new entrepreneurs and professionals. Let's grow our network and share our experiences with as many business leaders as possible. One of our biggest goals this year is to shine on the global stage. Let us focus our energy on international trade summits and conventions. These are wonderful opportunities to learn and show other countries the talent and innovation we have here.
                </p>
                <p>
                  We must also remember that how we present ourselves matters. I want us to project a professional look at all times. When we look sharp and professional, potential partners will see our discipline and want to collaborate with us. Let our meetings happen in style—let's do things differently and with such excellence that the business world takes notice of our unique way of working.
                </p>
                <p>
                  Professional growth remains at the heart of what we do. We will continue to promote our B2B initiatives to help our members grow. Instead of doing many small, separate ventures, let's work together on bigger, better partnerships that create a much louder voice and a lasting impact.
                </p>
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
