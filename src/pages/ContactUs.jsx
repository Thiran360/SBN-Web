import '../styles/ContactUs.css';

export default function ContactUs() {
  return (
    <div className="contact-us-page">
      <div className="contact-container">
        
        {/* Left Side: Contact Information */}
        <div className="contact-info-panel">
          <div className="panel-header">
            <span className="badge">Get in Touch</span>
            <h2>Let's Connect</h2>
            <p>Whether you have a question about membership, events, or partnerships, our team is ready to answer all your questions.</p>
          </div>

          <div className="info-items">
            <div className="info-item">
              <div className="icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="info-text">
                <h3>Our Location</h3>
                <p>National Head Quarters, 506 Windfall,<br />Sahar Plaza, J.B. Nagar, Andheri<br />(EAST) Mumbai 400 059</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="info-text">
                <h3>Email Address</h3>
                <p><a href="mailto:info@socialbussinessnetwork.in">info@socialbussinessnetwork.in</a></p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="info-text">
                <h3>Call Us Now</h3>
                <p><a href="tel:9342841619">93428 41619</a></p>
              </div>
            </div>
          </div>
          
          {/* Subtle background decoration */}
          <div className="panel-decoration"></div>
        </div>

        {/* Right Side: Map */}
        <div className="contact-map-panel">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.0125866750017!2d72.8687355153202!3d19.10708688706981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c841315fcb63%3A0xc546d1b3db92bc13!2sSBN%20INDIA%20NATIONAL%20HEADQUARTERS!5e0!3m2!1sen!2sin!4v1718712345678!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Social Business Network National Headquarters Map"
          ></iframe>
        </div>

      </div>
    </div>
  );
}
