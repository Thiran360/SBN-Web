import { useState } from 'react';
import '../../styles/Admin.css';

export default function AdminConnect() {
  const [activeTab, setActiveTab] = useState('received');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ connectTo: '', projectType: '' });
  
  const [givenConnects, setGivenConnects] = useState([]);
  const [receivedConnects, setReceivedConnects] = useState([]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!formData.connectTo || !formData.projectType) return;
    
    const newConnect = {
      id: Date.now(),
      connectTo: formData.connectTo,
      projectType: formData.projectType,
      date: new Date().toLocaleDateString()
    };
    
    setGivenConnects([newConnect, ...givenConnects]);
    setShowModal(false);
    setFormData({ connectTo: '', projectType: '' });
    setActiveTab('given');
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ connectTo: '', projectType: '' });
  };

  return (
    <div className="admin-page">
      <div className="admin-action-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Connect</h1>
        <button className="admin-btn-primary" onClick={() => setShowModal(true)}>
          + New Connect
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #ddd', marginBottom: '20px', marginTop: '20px' }}>
        <button 
          onClick={() => setActiveTab('received')}
          style={{ 
            padding: '10px 20px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'received' ? '3px solid #3A67B1' : 'none',
            color: activeTab === 'received' ? '#3A67B1' : '#666',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Received
        </button>
        <button 
          onClick={() => setActiveTab('given')}
          style={{ 
            padding: '10px 20px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'given' ? '3px solid #3A67B1' : 'none',
            color: activeTab === 'given' ? '#3A67B1' : '#666',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Given
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'received' && (
          <div>
            {receivedConnects.length === 0 ? (
              <p style={{ color: '#777', fontStyle: 'italic' }}>No received connects yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {receivedConnects.map(connect => (
                  <div key={connect.id} style={{ background: '#fff', padding: '15px 20px', borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    {/* Placeholder for received connect item layout */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'given' && (
          <div>
            {givenConnects.length === 0 ? (
              <p style={{ color: '#777', fontStyle: 'italic' }}>No given connects yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {givenConnects.map(connect => (
                  <div key={connect.id} style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong style={{ fontSize: '1.1rem', color: '#222' }}>To: {connect.connectTo}</strong>
                      <span style={{ color: '#777', fontSize: '0.9rem' }}>{connect.date}</span>
                    </div>
                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', border: '1px solid #eef2f5' }}>
                      <strong style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9rem' }}>Project Type assigned:</strong>
                      <p style={{ margin: 0, color: '#333', lineHeight: '1.5' }}>{connect.projectType}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '500px', 
            padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#1a1a2e', fontSize: '1.5rem' }}>New Connect</h2>
            <form onSubmit={handleSend}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444' }}>
                  Connect to _______
                </label>
                <input 
                  type="text" 
                  value={formData.connectTo}
                  onChange={(e) => setFormData({...formData, connectTo: e.target.value})}
                  className="admin-input" 
                  placeholder="Enter name or company"
                  required
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#444' }}>
                  What type of project are you assigning?
                </label>
                <textarea 
                  value={formData.projectType}
                  onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                  className="admin-input"
                  placeholder="Describe the project..."
                  rows="4"
                  required
                  style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button type="button" onClick={closeModal} style={{
                  padding: '10px 20px', background: '#f1f3f5', color: '#333', 
                  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  padding: '10px 24px', background: '#3A67B1', color: '#fff', 
                  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                }}>
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
