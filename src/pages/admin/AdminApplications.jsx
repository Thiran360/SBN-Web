import React from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminApplications() {
  const { siteData, updateSiteData } = useAdmin();
  const applications = siteData.membershipApplications || [];

  const updateStatus = (id, newStatus) => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    updateSiteData('membershipApplications', updated);
  };

  const deleteApplication = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      const updated = applications.filter(app => app.id !== id);
      updateSiteData('membershipApplications', updated);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Membership Applications</h1>
      </div>

      <div className="admin-card">
        {applications.length === 0 ? (
          <p style={{ padding: '20px', color: '#64748b' }}>No membership applications received yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Applicant Info</th>
                  <th>Chapter</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.firstName} {app.lastName}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{app.email}</div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{app.phone}</div>
                      <div style={{ fontSize: '0.85rem', color: '#3a67b1', marginTop: '4px' }}>{app.profession}</div>
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize' }}>{app.chapter}</span>
                    </td>
                    <td>{app.date}</td>
                    <td>
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <select 
                          value={app.status} 
                          onChange={(e) => updateStatus(app.id, e.target.value)}
                          className="status-select"
                          style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', marginRight: '8px' }}
                        >
                          <option value="New">New</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        <button 
                          type="button"
                          onClick={() => alert(`Message from ${app.firstName}:\n\n${app.message || 'No message provided.'}`)}
                          className="admin-btn-icon" 
                          title="View Message"
                        >
                          👁️
                        </button>
                        <button 
                          type="button"
                          onClick={() => deleteApplication(app.id)}
                          className="admin-btn-danger-icon" 
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
