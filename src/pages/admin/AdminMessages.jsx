import { useAdmin } from '../../context/AdminContext';
import '../../styles/Admin.css';

export default function AdminMessages() {
  const { siteData, updateSiteData } = useAdmin();
  const messages = siteData.contactMessages || [];

  const markAsRead = (index) => {
    const updated = [...messages];
    updated[index].read = true;
    updateSiteData('contactMessages', updated);
  };

  const deleteMessage = (index) => {
    const updated = messages.filter((_, i) => i !== index);
    updateSiteData('contactMessages', updated);
  };

  return (
    <div className="admin-page">
      <h1>Contact Messages</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>View submissions from the Contact Us form.</p>

      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, index) => (
            <div key={msg.id} className="admin-card" style={{ borderLeft: msg.read ? 'none' : '4px solid var(--sbn-blue)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{msg.subject}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#666' }}>From: {msg.name} ({msg.email}) - {msg.date}</p>
                </div>
                <div>
                  {!msg.read && <span style={{ background: 'var(--sbn-yellow)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', marginRight: '8px' }}>New</span>}
                </div>
              </div>
              <p style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', marginTop: '12px' }}>{msg.message}</p>
              
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                {!msg.read && <button type="button" onClick={() => markAsRead(index)} className="admin-btn-secondary">Mark as Read</button>}
                <button type="button" onClick={() => deleteMessage(index)} className="admin-btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
