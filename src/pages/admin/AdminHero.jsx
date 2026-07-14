import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import '../../styles/Admin.css';

export default function AdminHero() {
  const { siteData, updateSiteData } = useAdmin();
  const [slides, setSlides] = useState(siteData.heroSlides || []);

  const handleUpdate = (index, field, value) => {
    const updatedSlides = [...slides];
    updatedSlides[index][field] = value;
    setSlides(updatedSlides);
  };

  const handleSave = () => {
    updateSiteData('heroSlides', slides);
    alert('Hero slides saved successfully!');
  };

  const addNewSlide = (e) => {
    e.preventDefault();
    setSlides(prevSlides => [
      ...prevSlides,
      { id: Date.now() + Math.random(), image: '', title: '', subtitle: '', cta: 'Click Here', link: '#' }
    ]);
  };

  const deleteSlide = (index) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      const updatedSlides = slides.filter((_, i) => i !== index);
      setSlides(updatedSlides);
      updateSiteData('heroSlides', updatedSlides);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-action-bar">
        <h1>Manage Hero Slider</h1>
        <button onClick={handleSave} className="admin-btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          Save Changes
        </button>
      </div>

      <div style={{ marginTop: '50px', marginBottom: '32px', display: 'flex', justifyContent: 'flex-start' }}>
        <button type="button" onClick={addNewSlide} className="admin-btn-secondary" style={{ padding: '12px 32px', fontSize: '1rem', borderRadius: '8px', border: 'none', backgroundColor: '#3a67b1', color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }}>
          + Add New Slide
        </button>
      </div>

      {slides.map((slide, index) => (
        <div key={slide.id} className="admin-card">
          <div className="admin-card-header">
            <h3>Slide {index + 1}</h3>
            <button type="button" onClick={() => deleteSlide(index)} className="admin-btn-danger">Delete</button>
          </div>
          
          <label>Image URL:</label>
          <input 
            className="admin-input" 
            value={slide.image} 
            onChange={(e) => handleUpdate(index, 'image', e.target.value)} 
            placeholder="/images/hero-bg.png or https://..."
          />
          
          <label>Title (HTML allowed for breaks):</label>
          <input 
            className="admin-input" 
            value={slide.title} 
            onChange={(e) => handleUpdate(index, 'title', e.target.value)} 
          />
          
          <label>Subtitle:</label>
          <input 
            className="admin-input" 
            value={slide.subtitle} 
            onChange={(e) => handleUpdate(index, 'subtitle', e.target.value)} 
          />
          
          <label>Button Text:</label>
          <input 
            className="admin-input" 
            value={slide.cta} 
            onChange={(e) => handleUpdate(index, 'cta', e.target.value)} 
          />
          
          <label>Button Link:</label>
          <input 
            className="admin-input" 
            value={slide.link} 
            onChange={(e) => handleUpdate(index, 'link', e.target.value)} 
          />
        </div>
      ))}
    </div>
  );
}
