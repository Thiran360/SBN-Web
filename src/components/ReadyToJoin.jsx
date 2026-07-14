import { Link } from 'react-router-dom';
import '../styles/ReadyToJoin.css';

export default function ReadyToJoin() {
  return (
    <section className="ready-to-join">
      <div className="container ready-content">
        <h2 className="glow-title">Are You Ready?</h2>
        <Link to="/join-sbn" className="btn-join-glow" style={{ textDecoration: 'none', display: 'inline-block' }}>
          Join Now
        </Link>
      </div>
    </section>
  );
}
