import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import '../styles/JoinSBN.css';

export default function JoinSBN() {
  const { siteData, updateSiteData } = useAdmin();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    chapter: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newApp = {
      ...formData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    setTimeout(() => {
      const updatedApplications = [...(siteData.membershipApplications || []), newApp];
      updateSiteData('membershipApplications', updatedApplications);
      setIsSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', profession: '', chapter: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 800);
  };

  return (
    <div className="join-page">
      <div className="join-container">
        {/* Benefits Sidebar */}
        <div className="join-benefits">
          <h2 className="join-benefits-title">Why Join Us?</h2>
          <div className="benefit-list">
            <div className="benefit-item">
              <div className="benefit-icon icon-blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </div>
              <div className="benefit-text">
                <h3>Global Networking</h3>
                <p>Connect with 50,000+ professionals and entrepreneurs across 100+ global chapters.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon icon-green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <div className="benefit-text">
                <h3>Skill Development</h3>
                <p>Access exclusive training, leadership programs, and workshops to accelerate your career.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon icon-purple">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div className="benefit-text">
                <h3>Community Impact</h3>
                <p>Participate in meaningful community service projects and make a tangible difference.</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon icon-gold">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <div className="benefit-text">
                <h3>Recognition</h3>
                <p>Get recognized globally through SBN's awards programs for your business achievements.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="join-form-card">
          <div className="join-form-card-accent"></div>
          <div className="join-form-inner">
            <div className="join-form-header">
              <h2>Membership Application</h2>
              <p>Take the first step towards global networking and professional growth.</p>
            </div>

            <form className="join-form" onSubmit={handleSubmit}>
              {isSubmitted && (
                <div className="join-success">
                  <span className="success-icon">✓</span>
                  <span>Thank you! Your application has been successfully submitted. Our team will contact you shortly.</span>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
              </div>

              <div className="form-group field-full">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 234 567 890" />
              </div>

              <div className="form-group">
                <label htmlFor="profession">Profession / Title</label>
                <input type="text" id="profession" name="profession" value={formData.profession} onChange={handleChange} required placeholder="Software Engineer" />
              </div>

              <div className="form-group field-full">
                <label htmlFor="chapter">Preferred SBN Chapter</label>
                <select id="chapter" name="chapter" value={formData.chapter} onChange={handleChange} required>
                  <option value="" disabled>Select a Chapter</option>
                  <option value="bangalore">SBN Bangalore</option>
                  <option value="chennai">SBN Chennai</option>
                  <option value="mumbai">SBN Mumbai</option>
                  <option value="delhi">SBN Delhi</option>
                  <option value="hyderabad">SBN Hyderabad</option>
                  <option value="international">International / Other</option>
                </select>
              </div>

              <div className="form-group field-full">
                <label htmlFor="message">Why do you want to join SBN? (Optional)</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us briefly about your goals..."></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <span>Submit Application →</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
