import React, { useEffect, useRef, useState } from 'react';
import '../styles/Statistics.css';

const statsData = [
  { target: 5000, suffix: '+', label: 'Locations Worldwide' },
  { target: 200000, suffix: '+', label: 'Members & Alumni across the world' },
  { target: 1000, suffix: '+', label: 'Projects every year' },
  { target: 1, suffix: '', label: 'Only one organization. SBN.' },
];

function useCountUp(target, shouldAnimate) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(0); // Reset to 0 when out of view
      return;
    }
    let current = 0;
    const duration = 2000;
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

  return count;
}

function StatItem({ target, suffix, label, animate }) {
  const count = useCountUp(target, animate);
  return (
    <div className="stat-item">
      <h3>{count.toLocaleString()}{suffix}</h3>
      <p>{label}</p>
    </div>
  );
}

export default function Statistics() {
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
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="statistics" ref={sectionRef}>
      <div className="container stats-grid">
        {statsData.map((stat, index) => (
          <React.Fragment key={index}>
            {index > 0 && <div className="stat-divider" />}
            <StatItem
              target={stat.target}
              suffix={stat.suffix}
              label={stat.label}
              animate={isVisible}
            />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
