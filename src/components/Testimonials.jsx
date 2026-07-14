import { useState, useEffect } from 'react';
import '../styles/Testimonials.css';

const testimonialsData = [
  {
    quote: "Social Business Network has completely transformed my leadership skills. The projects and networking opportunities are unparalleled.",
    name: "Aarav Sharma",
    location: "SBN Mumbai",
    avatar: "https://i.pravatar.cc/150?img=11"
  },
  {
    quote: "Being part of SBN gave me the confidence to start my own business. The mentorship here is truly life-changing.",
    name: "Priya Patel",
    location: "SBN Bangalore",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  {
    quote: "The global perspective I've gained through international conferences has been invaluable for my career growth.",
    name: "Rohan Desai",
    location: "SBN Delhi",
    avatar: "https://i.pravatar.cc/150?img=12"
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonialsData.length);
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [activeIndex]);

  const activeTestimonial = testimonialsData[activeIndex];

  return (
    <section className="testimonials-section">
      <div className="container testimonials-container">
        <h2 className="testimonials-heading">What Our Members Say</h2>
        
        <div className="testimonials-layout">
          <div className="testimonial-main">
            <div className="testimonial-card">
              <div className="testimonial-card-inner">
                <div className="testimonial-quote-mark left">"</div>
                <div className="testimonial-content-wrapper">
                  <img src={activeTestimonial.avatar} alt={activeTestimonial.name} className="testimonial-avatar large" />
                  <div className="testimonial-text-wrapper">
                    <p className="testimonial-quote">"{activeTestimonial.quote}"</p>
                    <div className="testimonial-author">
                      <h4 className="testimonial-name">{activeTestimonial.name}</h4>
                      <p className="testimonial-location">{activeTestimonial.location}</p>
                    </div>
                  </div>
                </div>
                <div className="testimonial-quote-mark right">"</div>
              </div>
            </div>
          </div>

          <div className="testimonials-sidebar">
            <div className="testimonials-list">
              {testimonialsData.map((item, index) => (
                <div 
                  key={index} 
                  className={`testimonial-list-item ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <img src={item.avatar} alt={item.name} className="list-avatar" />
                  <div className="list-author-info">
                    <h4 className="list-name">{item.name}</h4>
                    <p className="list-location">{item.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
