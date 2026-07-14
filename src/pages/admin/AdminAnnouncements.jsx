import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminAnnouncements() {
  const { siteData, updateSiteData } = useAdmin();
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      const newNotification = {
        id: Date.now(),
        title: broadcastTitle,
        message: broadcastMessage,
        date: new Date().toISOString().split('T')[0],
        read: false
      };
      
      const updatedNotifications = [newNotification, ...(siteData.memberNotifications || [])];
      updateSiteData('memberNotifications', updatedNotifications);
      
      setBroadcastTitle('');
      setBroadcastMessage('');
      setIsBroadcasting(false);
      alert('Announcement successfully sent to all members!');
    }, 600);
  };

  const deleteAnnouncement = (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      const updatedNotifications = (siteData.memberNotifications || []).filter(n => n.id !== id);
      updateSiteData('memberNotifications', updatedNotifications);
    }
  };

  const notifications = siteData.memberNotifications || [];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Announcements</h1>
      </div>

      <div className="admin-card" style={{ marginBottom: '30px', padding: '30px', background: '#f8fafc', borderLeft: '4px solid var(--sbn-blue)' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', color: '#0f172a' }}>Post a New Announcement</h2>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Send a common message to all members. It will appear instantly in their notification bell.</p>
        
        <form onSubmit={handleBroadcast}>
          <div className="admin-form-group">
            <label>Announcement Title</label>
            <input 
              type="text" 
              className="admin-input" 
              placeholder="e.g. Upcoming Event Reminder, System Maintenance..." 
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              required
            />
          </div>
          <div className="admin-form-group">
            <label>Announcement Content</label>
            <textarea 
              className="admin-input" 
              rows="4" 
              placeholder="Type your message here to send to all registered members..."
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="admin-btn-primary" disabled={isBroadcasting} style={{ background: 'var(--sbn-blue, #3a67b1)', color: '#fff', padding: '12px 24px', fontSize: '1.05rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            {isBroadcasting ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', padding: '20px', borderBottom: '1px solid #e2e8f0' }}>Past Announcements</h2>
        {notifications.length === 0 ? (
          <p style={{ padding: '20px', color: '#64748b' }}>No announcements have been posted yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notif) => (
                  <tr key={notif.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{notif.date}</td>
                    <td style={{ fontWeight: 600 }}>{notif.title}</td>
                    <td style={{ color: '#475569' }}>{notif.message}</td>
                    <td>
                      <button 
                        type="button"
                        onClick={() => deleteAnnouncement(notif.id)}
                        className="admin-btn-danger-icon" 
                        title="Delete Announcement"
                      >
                        🗑️
                      </button>
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
