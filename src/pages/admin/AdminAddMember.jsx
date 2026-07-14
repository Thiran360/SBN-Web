import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import '../../styles/Admin.css';
import '../../styles/AdminAddMember.css';

export default function AdminAddMember() {
  const { siteData, updateSiteData } = useAdmin();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    company: '',
    industry: '',
    location: '',
    chapter: '',
    membershipType: 'Regular',
    joinDate: new Date().toISOString().split('T')[0],
    linkedin: '',
    website: '',
    notes: '',
    status: 'Active'
  });

  const [recentlyAdded, setRecentlyAdded] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`https://api.codingboss.in/crm/member/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create member on the server.');
      }

      const responseData = await response.json();
      const newMember = responseData.data || { id: Date.now(), ...formData };

      const updatedMembers = [...(siteData.members || []), newMember];
      updateSiteData('members', updatedMembers);

      setRecentlyAdded(prev => [newMember, ...prev]);
      setFormData({
        ...formData,
        name: '', email: '', phone: '', designation: '', company: '', linkedin: '', website: '', notes: ''
      });
      alert('Member created successfully!');
    } catch (err) {
      console.error(err);
      alert('Error creating member: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="add-member-header">
        <div>
          <h1>Add New Member</h1>
          <p className="add-member-subtitle">Fill in the details below to register a new SBN member.</p>
        </div>
        <button type="button" onClick={() => navigate('/admin/members')} className="admin-btn-secondary">
          ← Back to Members
        </button>
      </div>

      <form onSubmit={handleSubmit} className="add-member-form">

        {/* Section 1: Personal Information */}
        <div className="form-section">
          <div className="form-section-header">
            <div className="form-section-icon">👤</div>
            <h2>Personal Information</h2>
          </div>
          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Full Name <span className="required">*</span></label>
              <input type="text" name="name" className="admin-input" value={formData.name} onChange={handleChange} placeholder="e.g. Rajesh Kumar" required />
            </div>
            <div className="admin-form-group">
              <label>Email Address <span className="required">*</span></label>
              <input type="email" name="email" className="admin-input" value={formData.email} onChange={handleChange} placeholder="e.g. rajesh@company.com" required />
            </div>
            <div className="admin-form-group">
              <label>Phone Number <span className="required">*</span></label>
              <input type="tel" name="phone" className="admin-input" value={formData.phone} onChange={handleChange} placeholder="e.g. +91 98765 43210" required />
            </div>
            <div className="admin-form-group">
              <label>Designation / Title</label>
              <input type="text" name="designation" className="admin-input" value={formData.designation} onChange={handleChange} placeholder="e.g. CEO, Manager, Director" />
            </div>
          </div>
        </div>

        {/* Section 2: Business Information */}
        <div className="form-section">
          <div className="form-section-header">
            <div className="form-section-icon">🏢</div>
            <h2>Business Information</h2>
          </div>
          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>Company / Organization</label>
              <input type="text" name="company" className="admin-input" value={formData.company} onChange={handleChange} placeholder="e.g. ABC Pvt. Ltd." />
            </div>
            <div className="admin-form-group">
              <label>Industry / Sector</label>
              <select name="industry" className="admin-input" value={formData.industry} onChange={handleChange}>
                <option value="">Select Industry</option>
                <option value="Technology">Technology & IT</option>
                <option value="Finance">Finance & Banking</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Retail">Retail & E-commerce</option>
                <option value="Consulting">Consulting & Services</option>
                <option value="Media">Media & Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Business Website</label>
              <input type="url" name="website" className="admin-input" value={formData.website} onChange={handleChange} placeholder="https://www.example.com" />
            </div>
            <div className="admin-form-group">
              <label>LinkedIn Profile</label>
              <input type="url" name="linkedin" className="admin-input" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/name" />
            </div>
          </div>
        </div>

        {/* Section 3: Membership Details */}
        <div className="form-section">
          <div className="form-section-header">
            <div className="form-section-icon">🏷️</div>
            <h2>Membership Details</h2>
          </div>
          <div className="form-grid-2">
            <div className="admin-form-group">
              <label>City / Location <span className="required">*</span></label>
              <input type="text" name="location" className="admin-input" value={formData.location} onChange={handleChange} placeholder="e.g. Mumbai, Delhi, Chennai" required />
            </div>
            <div className="admin-form-group">
              <label>SBN Chapter <span className="required">*</span></label>
              <select name="chapter" className="admin-input" value={formData.chapter} onChange={handleChange} required>
                <option value="">Select Chapter</option>
                <option value="SBN Mumbai">SBN Mumbai</option>
                <option value="SBN Delhi">SBN Delhi</option>
                <option value="SBN Bangalore">SBN Bangalore</option>
                <option value="SBN Chennai">SBN Chennai</option>
                <option value="SBN Hyderabad">SBN Hyderabad</option>
                <option value="SBN Pune">SBN Pune</option>
                <option value="International">International / Other</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Membership Type</label>
              <select name="membershipType" className="admin-input" value={formData.membershipType} onChange={handleChange}>
                <option value="Regular">Regular Member</option>
                <option value="Premium">Premium Member</option>
                <option value="Honorary">Honorary Member</option>
                <option value="Founding">Founding Member</option>
                <option value="Student">Student Member</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label>Join Date <span className="required">*</span></label>
              <input type="date" name="joinDate" className="admin-input" value={formData.joinDate} onChange={handleChange} required />
            </div>
            <div className="admin-form-group">
              <label>Membership Status</label>
              <select name="status" className="admin-input" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Additional Notes */}
        <div className="form-section">
          <div className="form-section-header">
            <div className="form-section-icon">📝</div>
            <h2>Additional Notes</h2>
          </div>
          <div className="admin-form-group">
            <label>Internal Notes / Remarks</label>
            <textarea name="notes" className="admin-input" rows="3" value={formData.notes} onChange={handleChange} placeholder="Any special remarks or notes about this member..."></textarea>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/members')} className="admin-btn-secondary">
            Cancel
          </button>
          <button type="submit" className="admin-btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
            ✓ Add Member
          </button>
        </div>
      </form>

      {/* Recently Added Members Section */}
      {recentlyAdded.length > 0 && (
        <div style={{ marginTop: '40px', padding: '20px', background: '#f8f9fa', borderRadius: '12px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', color: '#333' }}>Recently Added Members</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {recentlyAdded.map(member => (
              <div key={member.id} style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eaeaea' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#222' }}>{member.name}</h3>
                <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '0.9rem' }}>
                  {member.designation} {member.company ? `at ${member.company}` : ''}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => navigate('/admin/gnote')}
                    style={{ flex: 1, padding: '10px', background: '#3A67B1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                  >
                    G-Note
                  </button>
                  <button
                    onClick={() => navigate('/admin/connect')}
                    style={{ flex: 1, padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
