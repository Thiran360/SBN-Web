import React, { useState, useEffect } from 'react';
import { FileText, IndianRupee } from 'lucide-react';

export default function MemberGnote() {
  const [activeTab, setActiveTab] = useState('given');
  const [gnotes, setGnotes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const memberProfile = (() => {
    try { return JSON.parse(localStorage.getItem('sbn_member_profile') || '{}'); } catch { return {}; }
  })();
  const loggedInIdStr = String(memberProfile.member_id || memberProfile.id || '');
  const loggedInName = memberProfile.name || '';

  useEffect(() => {
    const fetchGnotes = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`https://api.codingboss.in/crm/transaction/list/`, {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data.results || []);

          const mappedApiGnotes = list.map(g => ({
            id: g.id,
            to: g.to_member_name || `Member ${g.to_member_id || ''}`,
            toId: g.to_member_id,
            from: g.from_member_name || `Member ${g.from_member_id || ''}`,
            fromId: g.from_member_id,
            amount: g.amount || 0,
            description: g.description || '',
            date: g.created_at ? new Date(g.created_at).toLocaleDateString() : '',
            tableId: g.network_id,
            type: String(g.from_member_id) === loggedInIdStr ? 'given' : 'received'
          }));

          const localSaved = JSON.parse(localStorage.getItem('member_gnotes') || '[]');

          // Add locally created gnotes that don't have a matching API ID yet
          const localOnly = localSaved.filter(lg =>
            lg.id > 1000000000000 &&
            !mappedApiGnotes.some(ag => ag.fromId === lg.fromId && ag.toId === lg.toId && Number(ag.amount) === Number(lg.amount))
          );

          setGnotes([...mappedApiGnotes, ...localOnly]);
        } else {
          const saved = localStorage.getItem('member_gnotes');
          if (saved) setGnotes(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Failed to fetch gnotes:', err);
        const saved = localStorage.getItem('member_gnotes');
        if (saved) setGnotes(JSON.parse(saved));
      } finally {
        setIsFetching(false);
      }
    };

    fetchGnotes();
  }, [loggedInIdStr]);

  const validGnotes = gnotes.filter(g => String(g.fromId) !== String(g.toId) && g.from !== g.to);
  const givenGnotes = validGnotes.filter(g =>
    (loggedInIdStr && String(g.fromId) === loggedInIdStr) ||
    (loggedInName && g.from === loggedInName)
  );
  const receivedGnotes = validGnotes.filter(g =>
    (loggedInIdStr && String(g.toId) === loggedInIdStr) ||
    (loggedInName && g.to === loggedInName)
  );

  return (
    <div style={{ background: '#F2F4F9', minHeight: '100vh', padding: '130px 20px 80px', fontFamily: "'Roboto', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
          <div style={{ width: '45px', height: '45px', background: '#0052cc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} color="#fff" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', margin: 0 }}>My G-Notes</h1>
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
            Given ({givenGnotes.length})
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
            Received ({receivedGnotes.length})
          </button>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTab === 'given' ? (
            givenGnotes.length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>You haven't given any G-Notes yet.</p>
            ) : (
              givenGnotes.map(g => (
                <div key={g.id} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #E3EAF5', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontSize: '15px', color: '#444' }}>To: <strong style={{ color: '#111', fontSize: '16px' }}>{g.to}</strong></div>
                    <div style={{ fontSize: '13px', color: '#888' }}>{g.date}</div>
                  </div>
                  <div style={{ background: '#F8FAFF', padding: '16px', borderRadius: '10px', border: '1px solid #EEF2FF', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ flexShrink: 0, textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>Amount</div>
                      <div style={{ color: '#0052cc', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ₹ {parseFloat(g.amount).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ width: '1px', background: '#D8E0F0', alignSelf: 'stretch' }}></div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>Description</div>
                      <div style={{ color: '#222', fontSize: '15px', lineHeight: '1.5' }}>{g.description || 'No description provided'}</div>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            receivedGnotes.length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>You haven't received any G-Notes yet.</p>
            ) : (
              receivedGnotes.map(g => (
                <div key={g.id} style={{ background: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #E3EAF5', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontSize: '15px', color: '#444' }}>From: <strong style={{ color: '#111', fontSize: '16px' }}>{g.from}</strong></div>
                    <div style={{ fontSize: '13px', color: '#888' }}>{g.date}</div>
                  </div>
                  <div style={{ background: '#F8FAFF', padding: '16px', borderRadius: '10px', border: '1px solid #EEF2FF', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ flexShrink: 0, textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>Amount</div>
                      <div style={{ color: '#0052cc', fontSize: '20px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ₹ {parseFloat(g.amount).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ width: '1px', background: '#D8E0F0', alignSelf: 'stretch' }}></div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>Description</div>
                      <div style={{ color: '#222', fontSize: '15px', lineHeight: '1.5' }}>{g.description || 'No description provided'}</div>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
