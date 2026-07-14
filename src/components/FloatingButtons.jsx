import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileEdit, ChevronUp } from 'lucide-react';
import '../styles/FloatingButtons.css';

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <Link to="/join-sbn" className="fab-btn" style={{ textDecoration: 'none' }}>
        <span className="icon" style={{display: 'flex', alignItems: 'center'}}><FileEdit size={20} /></span>
        <span className="fab-text">BECOME A MEMBER</span>
      </Link>

      <button
        className={`scroll-top-btn ${showScrollTop ? '' : 'hidden'}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      >
        <ChevronUp size={24} />
      </button>
    </>
  );
}
