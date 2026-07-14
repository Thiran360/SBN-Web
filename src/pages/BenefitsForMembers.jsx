import '../styles/BenefitsForMembers.css';

export default function BenefitsForMembers() {
  return (
    <div className="benefits-page">
      <div className="benefits-container container">
        <div className="benefits-card">
          <div className="benefits-bg-pattern">
            {/* Top-left pattern */}
            <svg className="pattern-top" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50 -50C0 -20 50 20 80 80C100 120 120 180 80 220C40 260 -20 280 -60 280" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none"/>
              <path d="M-80 -80C-30 -50 30 -10 60 50C90 110 100 160 50 200C0 240 -50 250 -90 250" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none"/>
              <path d="M-110 -110C-60 -80 0 -40 30 20C60 80 80 130 20 180C-40 230 -80 230 -120 230" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none"/>
            </svg>
            
            {/* Bottom-right pattern */}
            <svg className="pattern-bottom" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 250C200 220 150 180 120 120C100 80 80 20 120 -20C160 -60 220 -80 260 -80" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none"/>
              <path d="M280 280C230 250 170 210 140 150C110 90 100 40 150 0C200 -40 250 -50 290 -50" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          
          <div className="benefits-content">
            <h2>Benefits For Members</h2>
            <p>
              As a member of SBN, you will have access to a global network of young active citizens who are committed to making a difference in the world. You will also have the opportunity to develop your leadership skills, social responsibility and entrepreneurship through SBN's training and development programs Networking with other young leaders from around the world, opportunities to take part in community service projects and travel and learn about other cultures, opportunities to Business, Additionally, you will be able to participate in SBN's awards programs and be recognized for your achievements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
