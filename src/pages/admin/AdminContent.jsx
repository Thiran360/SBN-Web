import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import '../../styles/Admin.css';

export default function AdminContent() {
  const { siteData, updateSiteData } = useAdmin();
  const [welcomeData, setWelcomeData] = useState(siteData.welcomeData);

  const handleUpdate = (field, value) => {
    setWelcomeData({ ...welcomeData, [field]: value });
  };

  const handleFeatureUpdate = (index, value) => {
    const updatedFeatures = [...welcomeData.features];
    updatedFeatures[index] = value;
    setWelcomeData({ ...welcomeData, features: updatedFeatures });
  };

  const handleSave = () => {
    updateSiteData('welcomeData', welcomeData);
    alert('Content saved successfully!');
  };

  return (
    <div className="admin-page">
      <div className="admin-action-bar">
        <h1>Manage Page Content</h1>
        <button onClick={handleSave} className="admin-btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          Save Changes
        </button>
      </div>

      <div className="admin-card">
        <h3>Welcome Section</h3>
        
        <label>Title:</label>
        <input 
          className="admin-input" 
          value={welcomeData.title} 
          onChange={(e) => handleUpdate('title', e.target.value)} 
        />
        
        <label>Description:</label>
        <textarea 
          className="admin-input" 
          value={welcomeData.description} 
          onChange={(e) => handleUpdate('description', e.target.value)} 
          rows="5"
        />

        <label>Image URL:</label>
        <input 
          className="admin-input" 
          value={welcomeData.image} 
          onChange={(e) => handleUpdate('image', e.target.value)} 
        />

        <h4>Statistics Badge</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Number:</label>
            <input 
              className="admin-input" 
              value={welcomeData.statsNumber} 
              onChange={(e) => handleUpdate('statsNumber', e.target.value)} 
            />
          </div>
          <div style={{ flex: 2 }}>
            <label>Text:</label>
            <input 
              className="admin-input" 
              value={welcomeData.statsText} 
              onChange={(e) => handleUpdate('statsText', e.target.value)} 
            />
          </div>
        </div>

        <h4>Features List</h4>
        {welcomeData.features.map((feature, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input 
              className="admin-input" 
              value={feature} 
              onChange={(e) => handleFeatureUpdate(index, e.target.value)} 
              style={{ marginBottom: 0 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
