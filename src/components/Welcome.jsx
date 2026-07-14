import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../context/AdminContext';
import '../styles/Welcome.css';

function useCountUp(targetString, shouldAnimate) {
  const [count, setCount] = useState(0);
  
  // Extract numeric part and suffix
  const numMatch = targetString.match(/(\d+)/);
  const target = numMatch ? parseInt(numMatch[0], 10) : 0;
  const suffix = targetString.replace(/\d/g, '');

  useEffect(() => {
    if (!shouldAnimate || target === 0) {
      setCount(0); // Reset to 0 when out of view
      return;
    }
    let current = 0;
    const duration = 1500; // Fast animation (1.5s)
    const steps = duration / 16;
    const increment = target / steps;
    let frame;

    function update() {
      current += increment;
      if (current >= target) {
        setCount(target);
        return;
      }
      setCount(Math.floor(current));
      frame = requestAnimationFrame(update);
    }

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [target, shouldAnimate]);

  return target === 0 ? targetString : `${count}${suffix}`;
}

export default function Welcome() {
  const { siteData } = useAdmin();
  const { title, description, features, statsNumber, statsText } = siteData.welcomeData;

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animatedStatsNumber = useCountUp(statsNumber, isVisible);

  return (
    <section className="welcome split-section" ref={sectionRef}>
      <div className="container split-container">
        <div className="split-left welcome-text">
          <h2 className="text-gradient">
            {title}
          </h2>
          <p>
            {description}
          </p>
          <ul className="feature-list">
            {features.map((item, index) => (
              <li key={index}>
                <span className="check-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="split-right welcome-image">
          <div className="image-wrapper globe-wrapper">
            <div className="globe-container">
              <video 
                src="/videos/earth.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="welcome-video"
              />
            </div>
            <div className="stats-badge globe-stats">
              <span className="number">
                {animatedStatsNumber}
              </span>
              <span className="badge-text">
                {statsText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
