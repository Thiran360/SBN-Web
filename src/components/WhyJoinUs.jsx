import { Globe2, Rocket, Compass } from 'lucide-react';
import '../styles/WhyJoinUs.css';

export default function WhyJoinUs() {
  return (
    <section className="why-join">
      <div className="why-join-bg"></div>
      <div className="container">
        <div className="section-header glass-header">
          <h2>Why Join SBN?</h2>
          <p className="section-description">
            Unlock global networking, accelerate your business growth, and develop essential leadership skills with the premier platform for young professionals. Connect, collaborate, and create lasting impact.
          </p>
        </div>

        <div className="glass-cards-container">
          <div className="glass-card card-left">
            <div className="card-icon-wrapper">
              <Globe2 size={48} className="card-icon" />
            </div>
            <div className="card-content">
              <h3>Global Networking Hub</h3>
              <p>Connect with young professionals worldwide</p>
            </div>
          </div>

          <div className="glass-card card-center">
            <div className="card-icon-wrapper">
              <Rocket size={48} className="card-icon" />
            </div>
            <div className="card-content">
              <h3>Accelerate Your Business</h3>
              <p>Access resources and partnerships</p>
            </div>
          </div>

          <div className="glass-card card-right">
            <div className="card-icon-wrapper">
              <Compass size={48} className="card-icon" />
            </div>
            <div className="card-content">
              <h3>Leadership Development</h3>
              <p>Hone essential skills through curated programs</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="wave-transition">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#2563eb" fillOpacity="1" d="M0,224L48,197.3C96,171,192,117,288,117.3C384,117,480,171,576,192C672,213,768,203,864,181.3C960,160,1056,128,1152,133.3C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#1d4ed8" fillOpacity="0.5" d="M0,192L48,202.7C96,213,192,235,288,213.3C384,192,480,128,576,128C672,128,768,192,864,224C960,256,1056,256,1152,229.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}
