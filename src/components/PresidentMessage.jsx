import { Link } from 'react-router-dom';
import '../styles/PresidentMessage.css';

export default function PresidentMessage() {
  return (
    <section className="president-message section-padding">
      <div className="container president-grid">
        <div className="president-image">
          <img src="/images/new-logo.png" alt="SBN Logo" loading="lazy" />
        </div>
        <div className="president-text">
          <span className="subtitle">Message from the Founder</span>
          <h2>SBN Leadership</h2>
          <p className="greeting">
            Dear Members of the Social Business Network,
          </p>
          <p className="message-body">
            It is a great pleasure to share my thoughts with all of you as we
            begin this new chapter together. This year is going to be an
            incredible time for our network. As your President, I
            want us to focus on making this &quot;The Year of Global
            Partnerships.&quot; This is our time to upgrade our standards, innovate
            how we collaborate, and show the world the true power of our network...
          </p>
          <Link to="/president-message" className="btn btn-yellow" style={{ textDecoration: 'none', display: 'inline-block' }}>
            Read More
          </Link>
        </div>
      </div>
    </section>
  );
}
