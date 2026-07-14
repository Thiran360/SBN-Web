import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Navigation, Users, User, Link2, FileText, Calendar, ChevronDown, ChevronUp, X, Send, PlusCircle, CreditCard } from 'lucide-react';

const API_BASE = 'https://api.codingboss.in/crm';

export default function MemberMyTables() {
  const [tablesList, setTablesList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Get the logged-in member's profile
  const memberProfile = (() => {
    try { return JSON.parse(localStorage.getItem('sbn_member_profile') || '{}'); } catch { return {}; }
  })();
  const loggedInMobile = memberProfile.mobile || '';
  const loggedInId = memberProfile.member_id || memberProfile.id || null;

  const [allConnects, setAllConnects] = useState([]);
  const [allGnotes, setAllGnotes] = useState([]);
  const [networkConnectsCount, setNetworkConnectsCount] = useState({});
  const [networkGnotesTotal, setNetworkGnotesTotal] = useState({});

  // Connect modal state
  const [connectModal, setConnectModal] = useState(null);
  const [connectForm, setConnectForm] = useState({ connectTo: '', projectType: '' });
  const [gnoteModal, setGnoteModal] = useState(null);
  const [gnoteForm, setGnoteForm] = useState({ amount: '', description: '' });
  const [successMsg, setSuccessMsg] = useState('');
  // View Members modal state
  const [selectedViewTable, setSelectedViewTable] = useState(null); // { table }
  const [networkMembersMap, setNetworkMembersMap] = useState({}); // { tableId: [members] }
  const [loadingMembers, setLoadingMembers] = useState(false);

  const fetchNetworkMembers = async (tableId) => {
    setLoadingMembers(true);
    try {
      const res = await fetch(`${API_BASE}/network/${tableId}/members/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (res.ok) {
        const data = await res.json();
        const members = Array.isArray(data) ? data : (data.results || []);
        setNetworkMembersMap(prev => ({ ...prev, [tableId]: members }));
        return members;
      }
      return [];
    } catch (e) {
      console.error('Error fetching network members:', e);
      return [];
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchTables = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      // 1. Fetch all networks
      const res = await fetch(`${API_BASE}/network/list/`, {
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
      });
      if (!res.ok) throw new Error('Failed to load tables.');
      const data = await res.json();
      const allNetworks = Array.isArray(data) ? data : (data.results || []);

      // 2. For each network, fetch its members AND its connects in parallel
      const membersPromises = allNetworks.map(net =>
        fetch(`${API_BASE}/network/${net.id}/members/`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        })
          .then(r => r.ok ? r.json() : [])
          .then(d => Array.isArray(d) ? d : (d.results || []))
          .catch(() => [])
      );

      const connectsPromise = fetch(`${API_BASE}/connect/list/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(r => r.ok ? r.json() : [])
        .then(d => Array.isArray(d) ? d : (d.results || []))
        .catch(() => []);

      const gnotesPromise = fetch(`${API_BASE}/transaction/list/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(r => r.ok ? r.json() : [])
        .then(d => Array.isArray(d) ? d : (d.results || []))
        .catch(() => []);

      const [membersResults, allApiConnects, allApiGnotes] = await Promise.all([
        Promise.all(membersPromises),
        connectsPromise,
        gnotesPromise
      ]);

      // 3. Build networkMembersMap, connectsMap, and filter networks
      const newMap = {};
      const newConnectsMap = {};
      const newGnotesMap = {};

      const filteredNetworks = allNetworks.filter((net, idx) => {
        const members = membersResults[idx];
        
        // Find connects and gnotes for this specific network from the master list
        const networkApiConnects = allApiConnects.filter(c => String(c.network_id) === String(net.id));
        const networkApiGnotes = allApiGnotes.filter(g => String(g.network_id) === String(net.id));

        newMap[net.id] = members;
        newConnectsMap[net.id] = networkApiConnects.length;
        newGnotesMap[net.id] = networkApiGnotes.reduce((sum, g) => sum + Number(g.amount || 0), 0);
        // Check if the logged-in member is in this network
        return members.some(m =>
          (loggedInMobile && (m.mobile === loggedInMobile || m.mobile_number === loggedInMobile)) ||
          (loggedInId && (m.id === loggedInId || m.member_id === loggedInId))
        );
      });

      setNetworkMembersMap(newMap);
      setNetworkConnectsCount(newConnectsMap);
      setNetworkGnotesTotal(newGnotesMap);
      setAllConnects(allApiConnects);
      setAllGnotes(allApiGnotes);
      setTablesList(filteredNetworks);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsFetching(false);
    }
  }, [loggedInMobile, loggedInId]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const [isSendingConnect, setIsSendingConnect] = useState(false);
  const [isSendingGnote, setIsSendingGnote] = useState(false);

  const handleConnectSend = async (e) => {
    e.preventDefault();
    setIsSendingConnect(true);

    let realFromId = loggedInId;
    if (loggedInMobile) {
      for (const tId in networkMembersMap) {
        const members = networkMembersMap[tId] || [];
        const match = members.find(m => String(m.mobile) === String(loggedInMobile) || String(m.mobile_number) === String(loggedInMobile));
        if (match) {
          realFromId = match.id || match.member_id;
          break;
        }
      }
    }

    const newConnect = {
      id: Date.now(),
      to: connectModal.member.name || connectModal.member.fullName,
      toId: connectModal.member.id || connectModal.member.member_id,
      from: memberProfile.name || 'Member',
      fromId: realFromId,
      projectType: connectForm.projectType,
      category: connectForm.category || '',
      subCategory: connectForm.subCategory || '',
      date: new Date().toLocaleDateString(),
      type: 'given',
      status: 'pending',
      tableId: connectModal.table.id || connectModal.table.name || connectModal.table.chapterName
    };

    try {
      // Call backend API
      const response = await fetch(`${API_BASE}/connect/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          network_id: newConnect.tableId,
          from_member_id: newConnect.fromId,
          to_member_id: newConnect.toId,
          project_details: newConnect.projectType,
          category: connectForm.category || '',
          sub_category: connectForm.subCategory || '',
          status: 'pending'
        })
      });

      if (!response.ok) {
        let errorMsg = `Status ${response.status}`;
        try {
          const errData = await response.json();
          errorMsg = errData.message || JSON.stringify(errData);
        } catch (e) { }
        throw new Error(errorMsg);
      }

      const existing = JSON.parse(localStorage.getItem('member_connects') || '[]');
      const updated = [newConnect, ...existing];
      localStorage.setItem('member_connects', JSON.stringify(updated));
      setSuccessMsg('Connect request sent successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setConnectModal(null);
      setConnectForm({ connectTo: '', projectType: '', category: '', subCategory: '' });
      fetchTables();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setIsSendingConnect(false);
    }
  };

  const handleGnoteSend = async (e) => {
    e.preventDefault();
    setIsSendingGnote(true);

    let realFromId = loggedInId;
    if (loggedInMobile) {
      for (const tId in networkMembersMap) {
        const members = networkMembersMap[tId] || [];
        const match = members.find(m => String(m.mobile) === String(loggedInMobile) || String(m.mobile_number) === String(loggedInMobile));
        if (match) {
          realFromId = match.id || match.member_id;
          break;
        }
      }
    }

    const newGnote = {
      id: Date.now(),
      to: gnoteModal.member.name || gnoteModal.member.fullName,
      toId: gnoteModal.member.id || gnoteModal.member.member_id,
      from: memberProfile.name || 'Member',
      fromId: realFromId,
      amount: gnoteForm.amount,
      description: gnoteForm.description,
      date: new Date().toLocaleDateString(),
      type: 'given',
      status: 'pending',
      tableId: gnoteModal.table.id || gnoteModal.table.name || gnoteModal.table.chapterName
    };

    try {
      const response = await fetch(`${API_BASE}/transaction/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          network_id: newGnote.tableId,
          from_member_id: newGnote.fromId,
          to_member_id: newGnote.toId,
          amount: newGnote.amount,
          description: newGnote.description,
          status: 'pending'
        })
      });

      if (!response.ok) {
        let errorMsg = `Status ${response.status}`;
        try {
          const errData = await response.json();
          errorMsg = errData.message || JSON.stringify(errData);
        } catch (e) { }
        throw new Error(errorMsg);
      }

      const existing = JSON.parse(localStorage.getItem('member_gnotes') || '[]');
      const updated = [newGnote, ...existing];
      localStorage.setItem('member_gnotes', JSON.stringify(updated));
      setSuccessMsg('G-Note recorded successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setGnoteModal(null);
      setGnoteForm({ amount: '', description: '' });
      fetchTables();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setIsSendingGnote(false);
    }
  };

  return (
    <div className="member-tables-container" style={{ background: '#F2F4F9', minHeight: '100vh', fontFamily: "'Roboto', sans-serif" }}>
      <style>{`
        .member-tables-container { padding: 130px 20px 80px; }
        .tables-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 22px; }
        .modal-card { width: 100%; max-width: 700px; }
        @media (max-width: 768px) {
          .member-tables-container { padding: 100px 15px 50px; }
          .tables-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
          .modal-card { max-width: 100%; border-radius: 12px !important; }
          .member-item { flex-direction: column; align-items: stretch !important; gap: 12px; }
          .action-buttons { flex-direction: row; flex-wrap: wrap; justify-content: flex-start; }
          .action-buttons button { flex: 1; justify-content: center; }
        }
      `}</style>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#3A67B1', margin: '0 0 10px' }}>My Tables</h1>
          <p style={{ fontSize: '16px', color: '#64666A', margin: 0 }}>
            View all your active chapter networks and connect with members.
          </p>
        </div>

        {/* Success Toast */}
        {successMsg && (
          <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#2e7d32', color: '#fff', padding: '14px 24px', borderRadius: '10px', zIndex: 9999, boxShadow: '0 6px 20px rgba(0,0,0,0.2)', fontWeight: '600', fontSize: '14px' }}>
            ✓ {successMsg}
          </div>
        )}

        {/* Loading/Error */}
        {isFetching && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#3A67B1', fontWeight: '600', fontSize: '16px' }}>
            ⏳ Loading tables...
          </div>
        )}
        {fetchError && (
          <div style={{ background: '#FFF0F0', border: '1px solid #FFCDD2', borderRadius: '10px', padding: '14px 18px', color: '#C62828', fontSize: '14px', marginBottom: '20px' }}>
            ⚠️ Could not load tables: {fetchError}
          </div>
        )}

        {/* Tables Grid */}
        {!isFetching && tablesList.length === 0 && !fetchError && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999', fontSize: '16px' }}>
            No tables found.
          </div>
        )}

        {!isFetching && tablesList.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '26px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a2e', margin: 0 }}>Active Tables</h3>
              <span style={{ background: 'linear-gradient(90deg, #3A67B1 0%, #1c407d 100%)', color: '#fff', borderRadius: '50px', padding: '3px 14px', fontSize: '14px', fontWeight: '700' }}>
                {tablesList.length}
              </span>
            </div>

            <div className="tables-grid">
              {tablesList.map((table, i) => {
                const tId = table.id || table.name || table.chapterName;

                // Use fetched API members count if available, else fallback to 0
                const apiMembersForCard = networkMembersMap[tId] || [];

                // Calculate dynamic stats for this table (using actual backend count if available)
                const tableConnects = networkConnectsCount[tId] !== undefined
                  ? networkConnectsCount[tId]
                  : allConnects.filter(c => String(c.tableId) === String(tId)).length;

                const tableGnotesTotal = networkGnotesTotal[tId] !== undefined
                  ? networkGnotesTotal[tId]
                  : allGnotes
                    .filter(g => String(g.tableId) === String(tId))
                    .reduce((sum, g) => sum + Number(g.amount || 0), 0);

                // Format total G-Note intelligently
                let displayGnotes = `₹ ${tableGnotesTotal}`;
                if (tableGnotesTotal >= 1000) {
                  displayGnotes = `₹ ${(tableGnotesTotal / 1000).toFixed(1)} K`;
                }

                return (
                  <div
                    key={tId}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      background: '#fff',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      border: '1px solid #E3EAF5',
                      boxShadow: hoveredCard === i ? '0 18px 40px rgba(58,103,177,0.2)' : '0 4px 16px rgba(58,103,177,0.07)',
                      transform: hoveredCard === i ? 'translateY(-5px)' : 'translateY(0)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Card Header */}
                    <div style={{
                      background: 'linear-gradient(135deg, #3A67B1 0%, #1c407d 100%)',
                      padding: '22px 20px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                      <div style={{ position: 'absolute', bottom: '-10px', right: '30px', width: '55px', height: '55px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                      <h4 style={{ margin: '0 0 6px', fontSize: '19px', fontWeight: '800', color: '#fff', position: 'relative' }}>
                        {table.name || table.chapterName}
                      </h4>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)', position: 'relative' }}>
                        Chairman: <strong style={{ color: '#fff' }}>{table.chairman_name || table.chairmanName}</strong>
                      </span>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '18px 20px' }}>
                      {[
                        { icon: <Navigation size={15} color="#3A67B1" />, label: 'Zone', val: table.zone || 'Zone 001' },
                        { icon: <Users size={15} color="#3A67B1" />, label: 'Members', val: networkMembersMap[tId] !== undefined ? apiMembersForCard.length : '...' },
                        { icon: <PlusCircle size={15} color="#3A67B1" />, label: 'Connects', val: tableConnects },
                        { icon: <CreditCard size={15} color="#3A67B1" />, label: 'Total G-Note', val: displayGnotes },
                      ].map(row => (
                        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F0F4FF' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#64666A', fontSize: '14px', fontWeight: '500' }}>
                            {row.icon} {row.label}
                          </div>
                          <span style={{ fontWeight: '600', color: '#1a1a2e', fontSize: '14px' }}>{row.val}</span>
                        </div>
                      ))}

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#CF2030', fontSize: '13px', fontWeight: '600' }}>
                          <Calendar size={15} /> Expires: {table.plan_expiry_date || table.planExpiryDate || '31 Jul 2026'}
                        </div>
                        <span style={{ background: '#EEF2FF', color: '#3A67B1', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                          Approved
                        </span>
                      </div>

                      {/* View Members Button */}
                      <button
                        onClick={async () => {
                          setSelectedViewTable({ table });
                          await fetchNetworkMembers(tId);
                        }}
                        style={{
                          width: '100%',
                          background: '#3A67B1',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '11px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1c407d'}
                        onMouseLeave={e => e.currentTarget.style.background = '#3A67B1'}
                      >
                        <User size={16} />
                        View Members
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── View Members Full Overlay ─── */}
      {selectedViewTable && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setSelectedViewTable(null); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(10,20,50,0.85)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '40px 20px',
            overflowY: 'auto'
          }}
        >
          <div className="modal-card" style={{
            background: '#fff',
            borderRadius: '22px',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
            fontFamily: "'Roboto', sans-serif"
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #3A67B1 0%, #1c407d 100%)',
              padding: '24px 28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 4px', color: '#fff', fontSize: '20px', fontWeight: '800' }}>
                  {selectedViewTable.table.name || selectedViewTable.table.chapterName}
                </h3>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>
                  {(() => { const tId = selectedViewTable.table.id || selectedViewTable.table.name; const m = networkMembersMap[tId] || []; return `${m.length} member${m.length !== 1 ? 's' : ''}`; })()}
                </span>
              </div>
              <button
                onClick={() => setSelectedViewTable(null)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Members list */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(() => {
                const tId = selectedViewTable.table.id || selectedViewTable.table.name;
                const viewMembers = networkMembersMap[tId] || [];
                if (loadingMembers) return (
                  <div style={{ textAlign: 'center', padding: '50px 0', color: '#3A67B1', fontWeight: '600', fontSize: '15px' }}>
                    ⏳ Loading members...
                  </div>
                );
                if (viewMembers.length === 0) return (
                  <div style={{ textAlign: 'center', padding: '50px 0', color: '#999', fontSize: '15px', fontStyle: 'italic' }}>
                    No members found in this network.
                  </div>
                );
                return viewMembers.map((member, mi) => (
                  <div key={member.id || mi} className="member-item" style={{
                    background: '#F8FAFF',
                    border: '1px solid #E3EAF5',
                    borderRadius: '14px',
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}>
                    {/* Avatar + Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3A67B1, #1c407d)',
                        color: '#fff', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: '800', fontSize: '18px', flexShrink: 0
                      }}>
                        {(member.name || member.fullName || 'M')[0].toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {member.name || member.fullName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '2px', wordBreak: 'break-all' }}>
                          {member.businessName || member.role || member.mobile || member.phone || ''}
                        </div>
                        {member.membershipId && (
                          <div style={{ fontSize: '11px', color: '#3A67B1', marginTop: '2px', fontWeight: '600' }}>
                            ID: {member.membershipId}
                          </div>
                        )}
                      </div>
                    </div>

                    {(() => {
                      const lId = String(loggedInId || '');
                      const lMob = String(loggedInMobile || '');

                      const mId = String(member.id || '');
                      const mMemId = String(member.member_id || '');
                      const mMob = String(member.mobile || '');
                      const mMobNum = String(member.mobile_number || '');

                      const isCurrentUser =
                        (lId && (mId === lId || mMemId === lId)) ||
                        (lMob && (mMob === lMob || mMobNum === lMob));

                      return (
                        <>
                          {/* Connect & G-Note Buttons */}
                          {!isCurrentUser ? (
                            <div className="action-buttons" style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                              <button
                                onClick={() => {
                                  setConnectModal({ member, table: selectedViewTable.table });
                                  setConnectForm({ connectTo: member.name || member.fullName, projectType: '', category: '', subCategory: '' });
                                }}
                                style={{
                                  background: '#EEF4FF', color: '#3A67B1',
                                  border: '1px solid #C5D8FF', borderRadius: '8px',
                                  padding: '9px 16px', fontSize: '13px', fontWeight: '600',
                                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                }}
                              >
                                <Link2 size={14} /> Connect
                              </button>
                              <button
                                onClick={() => {
                                  setGnoteModal({ member, table: selectedViewTable.table });
                                  setGnoteForm({ amount: '', description: '' });
                                }}
                                style={{
                                  background: '#FFF8E7', color: '#b45309',
                                  border: '1px solid #FFD97D', borderRadius: '8px',
                                  padding: '9px 16px', fontSize: '13px', fontWeight: '600',
                                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                }}
                              >
                                <FileText size={14} /> G-Note
                              </button>
                            </div>
                          ) : (
                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#059669', background: '#d1fae5', padding: '6px 12px', borderRadius: '8px', flexShrink: 0 }}>
                              (You)
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ─── Connect Modal (Professional Design) ─── */}
      {connectModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setConnectModal(null); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(10,20,50,0.85)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 3000, padding: '20px',
            fontFamily: "'Roboto', sans-serif"
          }}
        >
          <div style={{
            background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '480px',
            boxShadow: '0 30px 70px rgba(0,0,0,0.28)', overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3A67B1 0%, #1c407d 100%)',
              padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#fff' }}>Send Connect</h3>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>
                  To: {connectModal.member.name || connectModal.member.fullName}
                </span>
              </div>
              <button
                onClick={() => setConnectModal(null)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '28px' }}>
              <form onSubmit={handleConnectSend} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', color: '#444', marginBottom: '8px' }}>
                      Category
                    </label>
                    <input
                      type="text"
                      value={connectForm.category || ''}
                      onChange={e => setConnectForm({ ...connectForm, category: e.target.value })}
                      placeholder="e.g. Project Connect"
                      required
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '12px',
                        border: '1.5px solid #D8E0F0', fontSize: '15px', outline: 'none',
                        boxSizing: 'border-box', background: '#FAFBFF', transition: 'all 0.2s'
                      }}
                      onFocus={e => { e.target.style.borderColor = '#3A67B1'; e.target.style.boxShadow = '0 0 0 3px rgba(58,103,177,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#D8E0F0'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: '600', fontSize: '14px', color: '#444', marginBottom: '8px' }}>
                      Sub Category
                    </label>
                    <input
                      type="text"
                      value={connectForm.subCategory || ''}
                      onChange={e => setConnectForm({ ...connectForm, subCategory: e.target.value })}
                      placeholder="e.g. Developer"
                      required
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '12px',
                        border: '1.5px solid #D8E0F0', fontSize: '15px', outline: 'none',
                        boxSizing: 'border-box', background: '#FAFBFF', transition: 'all 0.2s'
                      }}
                      onFocus={e => { e.target.style.borderColor = '#3A67B1'; e.target.style.boxShadow = '0 0 0 3px rgba(58,103,177,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#D8E0F0'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: '600', fontSize: '14px', color: '#444', marginBottom: '8px' }}>
                    <Link2 size={16} color="#3A67B1" /> Project / Requirement Details
                  </label>
                  <textarea
                    value={connectForm.projectType}
                    onChange={e => setConnectForm({ ...connectForm, projectType: e.target.value })}
                    required
                    placeholder="E.g., Need consultation for Web Development..."
                    rows="3"
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: '12px',
                      border: '1.5px solid #D8E0F0', fontSize: '15px', outline: 'none',
                      boxSizing: 'border-box', resize: 'vertical', color: '#111',
                      background: '#FAFBFF', fontFamily: 'inherit', transition: 'all 0.2s'
                    }}
                    onFocus={e => { e.target.style.borderColor = '#3A67B1'; e.target.style.boxShadow = '0 0 0 3px rgba(58,103,177,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#D8E0F0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button type="button" onClick={() => setConnectModal(null)} style={{ padding: '12px 24px', background: '#F2F4F9', color: '#444', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', transition: 'background 0.2s' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isSendingConnect} style={{ padding: '12px 32px', background: 'linear-gradient(90deg, #3A67B1 0%, #1c407d 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s', opacity: isSendingConnect ? 0.7 : 1 }}>
                    <Send size={16} /> {isSendingConnect ? 'Sending...' : 'Send Connect'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── G-Note Modal (Professional Design) ─── */}
      {gnoteModal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setGnoteModal(null); }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(10,20,50,0.85)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 3000, padding: '20px',
            fontFamily: "'Roboto', sans-serif"
          }}
        >
          <div style={{
            background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '480px',
            boxShadow: '0 30px 70px rgba(0,0,0,0.28)', overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #0052cc 0%, #003d99 100%)',
              padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#fff' }}>Give G-Note</h3>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' }}>
                  To: {gnoteModal.member.name || gnoteModal.member.fullName}
                </span>
              </div>
              <button
                onClick={() => setGnoteModal(null)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '28px' }}>
              <form onSubmit={handleGnoteSend} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: '600', fontSize: '14px', color: '#444', marginBottom: '8px' }}>
                    <CreditCard size={16} color="#0052cc" /> Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={gnoteForm.amount}
                    onChange={e => setGnoteForm({ ...gnoteForm, amount: e.target.value })}
                    required
                    placeholder="E.g., 5000"
                    min="1"
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: '12px',
                      border: '1.5px solid #D8E0F0', fontSize: '16px', outline: 'none',
                      boxSizing: 'border-box', color: '#111', fontWeight: '600',
                      background: '#FAFBFF', fontFamily: 'inherit', transition: 'all 0.2s'
                    }}
                    onFocus={e => { e.target.style.borderColor = '#0052cc'; e.target.style.boxShadow = '0 0 0 3px rgba(0,82,204,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#D8E0F0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: '600', fontSize: '14px', color: '#444', marginBottom: '8px' }}>
                    <FileText size={16} color="#0052cc" /> Description (Optional)
                  </label>
                  <textarea
                    value={gnoteForm.description}
                    onChange={e => setGnoteForm({ ...gnoteForm, description: e.target.value })}
                    placeholder="E.g., Referral commission for Project X..."
                    rows="3"
                    style={{
                      width: '100%', padding: '14px 16px', borderRadius: '12px',
                      border: '1.5px solid #D8E0F0', fontSize: '15px', outline: 'none',
                      boxSizing: 'border-box', resize: 'vertical', color: '#111',
                      background: '#FAFBFF', fontFamily: 'inherit', transition: 'all 0.2s'
                    }}
                    onFocus={e => { e.target.style.borderColor = '#0052cc'; e.target.style.boxShadow = '0 0 0 3px rgba(0,82,204,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#D8E0F0'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button type="button" onClick={() => setGnoteModal(null)} style={{ padding: '12px 24px', background: '#F2F4F9', color: '#444', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', transition: 'background 0.2s' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isSendingGnote} style={{ padding: '12px 32px', background: 'linear-gradient(90deg, #0052cc 0%, #003d99 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s', opacity: isSendingGnote ? 0.7 : 1 }}>
                    <Send size={16} /> {isSendingGnote ? 'Sending...' : 'Send G-Note'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
