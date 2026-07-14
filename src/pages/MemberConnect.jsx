import React, { useState, useEffect } from 'react';
import { Link2, CheckCircle2 } from 'lucide-react';

export default function MemberConnect() {
  const [activeTab, setActiveTab] = useState('given');
  const [connects, setConnects] = useState([]);

  const memberProfile = (() => {
    try { return JSON.parse(localStorage.getItem('sbn_member_profile') || '{}'); } catch { return {}; }
  })();
  const loggedInId = memberProfile.member_id || memberProfile.id || null;
  const loggedInName = memberProfile.name || '';

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchConnects = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`https://api.codingboss.in/crm/connect/list/`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.results || []);

          // Map backend connects to our frontend format
          const mappedApiConnects = list.map(c => ({
            id: c.id,
            to: c.to_member_name || `Member ${c.to_member_id || ''}`,
            toId: c.to_member_id,
            from: c.from_member_name || `Member ${c.from_member_id || ''}`,
            fromId: c.from_member_id,
            category: c.category || '',
            subCategory: c.sub_category || '',
            projectType: c.project_details || c.description || '',
            date: c.created_at ? new Date(c.created_at).toLocaleDateString() : '',
            status: c.status || 'pending',
            tableId: c.network_id
          }));

          let allConnectsData = [...mappedApiConnects];

          // Deduplicate the display: Only show the most recent connection per user pair
          const latestConnectsMap = new Map();
          allConnectsData.forEach(c => {
            const pairKey = `${c.fromId}-${c.toId}`;
            if (!latestConnectsMap.has(pairKey)) {
              latestConnectsMap.set(pairKey, c);
            } else {
              const existing = latestConnectsMap.get(pairKey);
              // Simple heuristic: higher ID usually means newer (especially for local Date.now() IDs and incrementing backend IDs)
              if (c.id > existing.id) {
                latestConnectsMap.set(pairKey, c);
              }
            }
          });

          setConnects(Array.from(latestConnectsMap.values()));
        } else {
          setConnects([]);
        }
      } catch (err) {
        console.error('Failed to fetch connects:', err);
        setConnects([]);
      } finally {
        setIsFetching(false);
      }
    };

    fetchConnects();
  }, []);

  const handleAccept = async (id) => {
    // 1. Optimistic UI update so it instantly turns green for the receiver
    const updated = connects.map(c => c.id === id ? { ...c, status: 'accepted' } : c);
    setConnects(updated);
    localStorage.setItem('member_connects', JSON.stringify(updated));

    // 2. Update on backend
    try {
      const payload = { status: 'accepted' };
      // Try standard DRF update endpoint
      let res = await fetch(`https://api.codingboss.in/crm/connect/update/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify(payload)
      });
      
      // If 404, try PATCH instead, or alternative endpoint structure
      if (!res.ok && res.status === 404) {
        res = await fetch(`https://api.codingboss.in/crm/connect/${id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
          body: JSON.stringify(payload)
        });
      }
    } catch (err) {
      console.error('Failed to accept connect on backend:', err);
    }
  };

  // Filter connects and completely exclude any self-connects (where sender is receiver)
  const validConnects = connects.filter(c => c.fromId !== c.toId && c.from !== c.to);

  const givenConnects = validConnects.filter(c =>
    (loggedInId && String(c.fromId) === String(loggedInId)) ||
    (loggedInName && c.from === loggedInName)
  );
  const receivedConnects = validConnects.filter(c =>
    (loggedInId && String(c.toId) === String(loggedInId)) ||
    (loggedInName && c.to === loggedInName)
  );

  return (
    <div style={{ background: '#F2F4F9', minHeight: '100vh', padding: '130px 20px 80px', fontFamily: "'Roboto', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <div style={{ width: '45px', height: '45px', background: '#002e6e', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link2 size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>My Connects</h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '2px solid #E3EAF5', marginBottom: '30px' }}>
          <button
            onClick={() => setActiveTab('given')}
            style={{
              padding: '10px 20px', background: 'none', border: 'none',
              borderBottom: activeTab === 'given' ? '3px solid #0052cc' : 'none',
              color: activeTab === 'given' ? '#0052cc' : '#666',
              fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s'
            }}
          >
            Given ({givenConnects.length})
          </button>
          <button
            onClick={() => setActiveTab('received')}
            style={{
              padding: '10px 20px', background: 'none', border: 'none',
              borderBottom: activeTab === 'received' ? '3px solid #0052cc' : 'none',
              color: activeTab === 'received' ? '#0052cc' : '#666',
              fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s'
            }}
          >
            Received ({receivedConnects.length})
          </button>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTab === 'given' ? (
            givenConnects.length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>You haven't given any connects yet.</p>
            ) : (
              givenConnects.map(c => (
                <div key={c.id} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #E3EAF5', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontSize: '15px', color: '#444' }}>To: <strong style={{ color: '#111', fontSize: '16px' }}>{c.to}</strong></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {c.status === 'accepted' ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '12px', fontWeight: '700', background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px' }}>
                          <CheckCircle2 size={14} /> Accepted
                        </span>
                      ) : (
                        <span style={{ color: '#d97706', fontSize: '12px', fontWeight: '700', background: '#fef3c7', padding: '4px 8px', borderRadius: '6px' }}>Pending</span>
                      )}
                      <div style={{ fontSize: '13px', color: '#888' }}>{c.date}</div>
                    </div>
                  </div>

                  {(c.category || c.subCategory) && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {c.category && <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{c.category}</span>}
                      {c.subCategory && <span style={{ background: '#f3e8ff', color: '#6b21a8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{c.subCategory}</span>}
                    </div>
                  )}

                  <div style={{ background: '#F8FAFF', padding: '16px', borderRadius: '10px', border: '1px solid #EEF2FF' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>Project Assigned</div>
                    <div style={{ color: '#222', fontSize: '15px', lineHeight: '1.5' }}>{c.projectType}</div>
                  </div>
                </div>
              ))
            )
          ) : (
            receivedConnects.length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>You haven't received any connects yet.</p>
            ) : (
              receivedConnects.map(c => (
                <div key={c.id} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #E3EAF5', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontSize: '15px', color: '#444' }}>From: <strong style={{ color: '#111', fontSize: '16px' }}>{c.from}</strong></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {c.status === 'accepted' ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '12px', fontWeight: '700', background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px' }}>
                          <CheckCircle2 size={14} /> Accepted
                        </span>
                      ) : (
                        <span style={{ color: '#d97706', fontSize: '12px', fontWeight: '700', background: '#fef3c7', padding: '4px 8px', borderRadius: '6px' }}>Pending</span>
                      )}
                      <div style={{ fontSize: '13px', color: '#888' }}>{c.date}</div>
                    </div>
                  </div>

                  {(c.category || c.subCategory) && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      {c.category && <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{c.category}</span>}
                      {c.subCategory && <span style={{ background: '#f3e8ff', color: '#6b21a8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{c.subCategory}</span>}
                    </div>
                  )}

                  <div style={{ background: '#F8FAFF', padding: '16px', borderRadius: '10px', border: '1px solid #EEF2FF', marginBottom: c.status !== 'accepted' ? '16px' : '0' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>Project Assigned</div>
                    <div style={{ color: '#222', fontSize: '15px', lineHeight: '1.5' }}>{c.projectType}</div>
                  </div>
                  {c.status !== 'accepted' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleAccept(c.id)}
                        style={{ background: '#0052cc', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <CheckCircle2 size={16} /> Accept Connect
                      </button>
                    </div>
                  )}
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
