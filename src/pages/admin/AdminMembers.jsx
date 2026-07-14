import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import '../../styles/Admin.css';

export default function AdminMembers() {
  const { siteData, updateSiteData } = useAdmin();
  const navigate = useNavigate();
  const [members, setMembers] = useState(siteData.members || []);

  const handleUpdate = (index, field, value) => {
    const updated = [...members];
    updated[index][field] = value;
    setMembers(updated);
  };

  const handleSave = () => {
    updateSiteData('members', members);
    alert('Members saved successfully!');
  };

  const deleteMember = (index) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);
  };

  return (
    <div className="admin-page">
      <div className="admin-action-bar">
        <h1>Manage Members</h1>
        <button onClick={handleSave} className="admin-btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
          Save Changes
        </button>
      </div>

      <div style={{ marginTop: '70px', marginBottom: '24px', paddingTop: '10px' }}>
        <Link to="/admin/members/add" className="admin-btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
          + Add New Member
        </Link>
      </div>

      <div className="admin-table-wrapper" style={{ overflowX: 'auto' }}>
        <table className="admin-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Location</th>
              <th style={{ padding: '12px' }}>Join Date</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>
                  <input 
                    className="admin-input" style={{ marginBottom: 0 }}
                    value={member.name} 
                    onChange={(e) => handleUpdate(index, 'name', e.target.value)} 
                  />
                </td>
                <td style={{ padding: '12px' }}>
                  <input 
                    className="admin-input" style={{ marginBottom: 0 }}
                    value={member.location} 
                    onChange={(e) => handleUpdate(index, 'location', e.target.value)} 
                  />
                </td>
                <td style={{ padding: '12px' }}>
                  <input 
                    type="date"
                    className="admin-input" style={{ marginBottom: 0 }}
                    value={member.joinDate} 
                    onChange={(e) => handleUpdate(index, 'joinDate', e.target.value)} 
                  />
                </td>
                <td style={{ padding: '12px' }}>
                  <select 
                    className="admin-input" style={{ marginBottom: 0 }}
                    value={member.status} 
                    onChange={(e) => handleUpdate(index, 'status', e.target.value)} 
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                  <button type="button" onClick={() => navigate('/admin/gnote')} className="admin-btn-primary" style={{ padding: '8px 12px', marginRight: '8px' }}>G-Note</button>
                  <button type="button" onClick={() => navigate('/admin/connect')} className="admin-btn-primary" style={{ padding: '8px 12px', marginRight: '8px', backgroundColor: '#28a745' }}>Connect</button>
                  <button type="button" onClick={() => deleteMember(index)} className="admin-btn-danger" style={{ padding: '8px 12px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
