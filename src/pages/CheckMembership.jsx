import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import '../styles/CheckMembership.css';

export default function CheckMembership() {
  const { siteData } = useAdmin();
  const [searchParams, setSearchParams] = useState({
    zone: '',
    chapter: '',
    name: ''
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    
    // Find the member in the mock database
    const members = siteData.members || [];
    
    const foundMember = members.find(m => {
      // Very simple matching logic for demonstration
      const nameMatch = searchParams.name ? m.name.toLowerCase().includes(searchParams.name.toLowerCase()) : false;
      const chapterMatch = searchParams.chapter ? m.location.toLowerCase().includes(searchParams.chapter.toLowerCase()) : false;
      return nameMatch && chapterMatch;
    });

    setSearchResult(foundMember || null);
  };

  return (
    <div className="check-membership-page">
      <div className="cm-content">
        <div className="cm-card">
          <h2>Validate Membership</h2>
          
          <form className="cm-form" onSubmit={handleSearch}>
            <div className="form-group">
              <label><span className="required">*</span> Zone</label>
              <select 
                value={searchParams.zone}
                onChange={(e) => setSearchParams({...searchParams, zone: e.target.value})}
                required
              >
                <option value="" disabled>Select Zone</option>
                <option value="North">North Zone</option>
                <option value="South">South Zone</option>
                <option value="East">East Zone</option>
                <option value="West">West Zone</option>
              </select>
            </div>
            
            <div className="form-group">
              <label><span className="required">*</span> LO Name (Chapter)</label>
              <select 
                value={searchParams.chapter}
                onChange={(e) => setSearchParams({...searchParams, chapter: e.target.value})}
                required
              >
                <option value="" disabled>Select Chapter</option>
                <option value="Mumbai">SBN Mumbai</option>
                <option value="Bangalore">SBN Bangalore</option>
                <option value="Delhi">SBN Delhi</option>
                <option value="Chennai">SBN Chennai</option>
                <option value="Hyderabad">SBN Hyderabad</option>
              </select>
            </div>

            <div className="form-group">
              <label><span className="required">*</span> Member Name</label>
              <input 
                type="text" 
                value={searchParams.name}
                onChange={(e) => setSearchParams({...searchParams, name: e.target.value})}
                placeholder="e.g. Aarav Sharma"
                required
                className="cm-input"
              />
            </div>

            <div className="form-group submit-group">
              <button type="submit" className="search-btn">Search</button>
            </div>
          </form>

          {/* Results Area */}
          {hasSearched && (
            <div className="cm-results-area">
              {searchResult ? (
                <div className="cm-success-card">
                  <div className="cm-success-icon">✓</div>
                  <div className="cm-success-info">
                    <h3>Active Member Found</h3>
                    <p><strong>Name:</strong> {searchResult.name}</p>
                    <p><strong>Chapter:</strong> {searchResult.location}</p>
                    <p><strong>Status:</strong> <span className={`status-badge ${searchResult.status.toLowerCase()}`}>{searchResult.status}</span></p>
                    <p><strong>Join Date:</strong> {searchResult.joinDate}</p>
                  </div>
                </div>
              ) : (
                <div className="cm-error-card">
                  <div className="cm-error-icon">✕</div>
                  <div className="cm-error-info">
                    <h3>No Membership Found</h3>
                    <p>We could not find an active membership matching those details. Please check the spelling or ensure the correct chapter is selected.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
