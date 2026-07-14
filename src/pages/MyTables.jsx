import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Map, Navigation, User, Calendar, PlusCircle, X, Phone, Briefcase, CreditCard, Lock, UserPlus, Trash2, Users } from 'lucide-react';

const API_BASE = 'https://api.codingboss.in/crm'; 

export default function MyTables() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    chapterName: '', zone: '', state: '', district: '', chairmanName: '', planExpiryDate: ''
  });

  const [tablesList, setTablesList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  // Manage Users modal state
  const [memberForm, setMemberForm] = useState({
    fullName: '', businessName: '', membershipId: '', mobile: '', password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [createdMembers, setCreatedMembers] = useState([]); // members created but not yet added

  const [networkMembers, setNetworkMembers] = useState([]);
  const [loadingNetworkMembers, setLoadingNetworkMembers] = useState(false);
  const [networkConnectsCount, setNetworkConnectsCount] = useState({});

  const fetchNetworkMembers = async (tableId) => {
    setLoadingNetworkMembers(true);
    try {
      const res = await fetch(`${API_BASE}/network/${tableId}/members/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (res.ok) {
        const data = await res.json();
        setNetworkMembers(Array.isArray(data) ? data : (data.results || []));
      } else {
        setNetworkMembers([]);
      }
    } catch (e) {
      console.error('Error fetching network members:', e);
      setNetworkMembers([]);
    } finally {
      setLoadingNetworkMembers(false);
    }
  };

  const [tableUsers, setTableUsers] = useState({});
  const [memberFormError, setMemberFormError] = useState('');
  const [networkMembersCount, setNetworkMembersCount] = useState({});
  const [networkGnotesTotal, setNetworkGnotesTotal] = useState({});

  // Track connects and gnotes to compute card stats
  const [allConnects, setAllConnects] = useState([]);
  const [allGnotes, setAllGnotes] = useState([]);

  const [hoveredCard, setHoveredCard] = useState(null);

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', tableId: null, userId: null, title: '', message: '' });

  const fetchTables = useCallback(async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      const res = await fetch(`${API_BASE}/network/list/`, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (!res.ok) throw new Error('Failed to load tables.');
      const data = await res.json();
      const allNetworks = Array.isArray(data) ? data : (data.results || []);

      // Fetch connects and members in parallel
      const membersPromises = allNetworks.map(net =>
        fetch(`${API_BASE}/network/${net.id}/members/`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
          .then(r => r.ok ? r.json() : [])
          .then(d => Array.isArray(d) ? d : (d.results || []))
          .catch(() => [])
      );

      const allConnectsPromise = fetch(`${API_BASE}/connect/list/`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
        .then(r => r.ok ? r.json() : [])
        .then(d => Array.isArray(d) ? d : (d.results || []))
        .catch(() => []);

      const allGnotesPromise = fetch(`${API_BASE}/transaction/list/`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
        .then(r => r.ok ? r.json() : [])
        .then(d => Array.isArray(d) ? d : (d.results || []))
        .catch(() => []);

      const [membersResults, allApiConnects, allApiGnotes] = await Promise.all([
        Promise.all(membersPromises),
        allConnectsPromise,
        allGnotesPromise
      ]);

      const connectsMap = {};
      const membersMap = {};
      const gnotesMap = {};
      allNetworks.forEach((net, idx) => {
        // Find connects and gnotes for this specific network from the master list
        const networkApiConnects = allApiConnects.filter(c => String(c.network_id) === String(net.id));
        const networkApiGnotes = allApiGnotes.filter(g => String(g.network_id) === String(net.id));

        connectsMap[net.id] = networkApiConnects.length;
        membersMap[net.id] = membersResults[idx].length;
        gnotesMap[net.id] = networkApiGnotes.reduce((sum, g) => sum + Number(g.amount || 0), 0);
      });

      setNetworkConnectsCount(connectsMap);
      setNetworkMembersCount(membersMap);
      setNetworkGnotesTotal(gnotesMap);
      setAllConnects(allApiConnects);
      setAllGnotes(allApiGnotes);
      setTablesList(allNetworks);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();

  }, [fetchTables]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/network/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          name: formData.chapterName,
          zone: formData.zone,
          state: formData.state,
          district: formData.district,
          chairman_name: formData.chairmanName,
          plan_expiry_date: formData.planExpiryDate
        })
      });
      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt);
      }
      setFormData({ chapterName: '', zone: '', state: '', district: '', chairmanName: '', planExpiryDate: '' });
      // Refresh list from server
      await fetchTables();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all members from API
  const fetchMemberList = async () => {
    try {
      const res = await fetch(`${API_BASE}/member/list/`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      if (!res.ok) return;
      const data = await res.json();
      const members = Array.isArray(data) ? data : (data.results || data.members || []);
      const mapped = members.map(m => ({
        id: m.id || m.member_id || Date.now(),
        fullName: m.name || m.full_name || '',
        businessName: m.business_name || '',
        membershipId: m.membership_id || '',
        mobile: m.mobile || '',
      }));
      setCreatedMembers(mapped);
    } catch (err) {
      console.error('Failed to fetch member list:', err);
    }
  };

  // Create member from form
  const handleCreateMember = async (e) => {
    e.preventDefault();
    setMemberFormError('');
    if (!memberForm.fullName.trim() || !memberForm.mobile.trim() || !memberForm.password.trim()) {
      setMemberFormError('Please fill in all required fields.');
      return;
    }

    // Save the newly created member to localStorage for local login without API (FOR NOW)
    try {
      const localMembers = JSON.parse(localStorage.getItem('local_members') || '[]');
      localMembers.push({
        mobile: memberForm.mobile.trim(),
        password: memberForm.password.trim(),
        name: memberForm.fullName,
        business_name: memberForm.businessName,
        member_id: memberForm.membershipId || Date.now()
      });
      localStorage.setItem('local_members', JSON.stringify(localMembers));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }

    try {
      const response = await fetch(`${API_BASE}/member/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          name: memberForm.fullName,
          business_name: memberForm.businessName,
          membership_id: memberForm.membershipId,
          mobile: memberForm.mobile,
          password: memberForm.password
        })
      });

      if (!response.ok) {
        let errMsg = 'Failed to create member on server';
        try {
          const errJson = await response.json();
          errMsg = errJson.message || errJson.detail || JSON.stringify(errJson);
        } catch {
          errMsg = await response.text();
        }
        console.warn('API Error, but saved locally:', errMsg);
      }

      setMemberForm({ fullName: '', businessName: '', membershipId: '', mobile: '', password: '' });
      await fetchMemberList();

    } catch (err) {
      console.error('API Network error:', err.message);
      // Even if API fails, clear form because we saved locally
      setMemberForm({ fullName: '', businessName: '', membershipId: '', mobile: '', password: '' });
    }
  };

  const [addingMemberId, setAddingMemberId] = useState(null);

  // Add a created member to the selected table
  const handleAddToTable = async (member) => {
    if (!selectedTable) return;
    const tableId = selectedTable.id || selectedTable.name || selectedTable.chapterName;

    setAddingMemberId(member.id);
    try {
      const response = await fetch(`${API_BASE}/member/add-existing/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          member_id: member.id,
          network_id: selectedTable.id || tableId
        })
      });

      if (!response.ok) {
        let errMsg = 'Failed to add member to table';
        try {
          const errJson = await response.json();
          errMsg = errJson.message || errJson.detail || errMsg;
        } catch { /* ignore */ }
        alert('Error: ' + errMsg);
        return;
      }

      await fetchNetworkMembers(tableId);

    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      setAddingMemberId(null);
    }
  };

  const handleConfirmAction = async () => {
    const { type, tableId, userId } = confirmModal;
    setConfirmModal({ isOpen: false, type: '', tableId: null, userId: null, title: '', message: '' });

    if (type === 'table') {
      try {
        const res = await fetch(`${API_BASE}/network/delete/${tableId}/`, {
          method: 'DELETE',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        if (!res.ok) {
          let errMsg = 'Failed to delete table';
          try {
            const errJson = await res.json();
            errMsg = errJson.message || errJson.detail || errMsg;
          } catch { /* ignore */ }
          alert('Error: ' + errMsg);
          return;
        }

        setTablesList(prev => prev.filter(t => (t.id || t.chapterName) !== tableId));
      } catch (err) {
        alert('Network error deleting table: ' + err.message);
      }
    } else if (type === 'member') {
      try {
        const res = await fetch(`${API_BASE}/member/delete/${userId}/`, {
          method: 'DELETE',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });

        if (!res.ok && res.status !== 404) {
          let errMsg = 'Failed to delete member';
          try {
            const errJson = await res.json();
            errMsg = errJson.message || errJson.detail || errMsg;
          } catch { /* ignore */ }
          alert('Error: ' + errMsg);
          return;
        }

        await fetchMemberList();
        await fetchNetworkMembers(tableId);
      } catch (err) {
        alert('Network error: ' + err.message);
      }
    }
  };

  const cancelConfirm = () => {
    setConfirmModal({ isOpen: false, type: '', tableId: null, userId: null, title: '', message: '' });
  };

  const handleDeleteTable = (tId) => {
    setConfirmModal({
      isOpen: true,
      type: 'table',
      tableId: tId,
      title: 'Delete Table',
      message: 'Are you sure you want to delete this table? This action cannot be undone.'
    });
  };

  const closeModal = () => {
    setSelectedTable(null);
    setNetworkMembers([]);
    setMemberForm({ fullName: '', businessName: '', membershipId: '', mobile: '', password: '' });
    setCreatedMembers([]);
    setMemberFormError('');
  };

  const fieldInput = (name, value, placeholder, type = 'text') => ({
    name,
    value,
    placeholder,
    type,
    required: true,
    onChange: handleChange,
    style: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '10px',
      border: '1.5px solid #D8E0F0',
      fontSize: '15px',
      outline: 'none',
      fontFamily: 'inherit',
      color: '#111',
      background: '#FAFBFF',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    },
    onFocus: e => {
      e.target.style.borderColor = '#3A67B1';
      e.target.style.boxShadow = '0 0 0 3px rgba(58,103,177,0.13)';
    },
    onBlur: e => {
      e.target.style.borderColor = '#D8E0F0';
      e.target.style.boxShadow = 'none';
    }
  });

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontWeight: '600',
    fontSize: '13px',
    color: '#444',
    marginBottom: '7px',
    textTransform: 'uppercase',
    letterSpacing: '0.4px'
  };

  const formFields = [
    { icon: <Building2 size={14} color="#3A67B1" />, label: 'Chapter / Network Name', name: 'chapterName', placeholder: 'e.g. SBN Chapter Madurai', type: 'text' },
    { icon: <Navigation size={14} color="#3A67B1" />, label: 'Zone', name: 'zone', placeholder: 'e.g. South Zone', type: 'text' },
    { icon: <Map size={14} color="#3A67B1" />, label: 'State', name: 'state', placeholder: 'e.g. Tamil Nadu', type: 'text' },
    { icon: <MapPin size={14} color="#3A67B1" />, label: 'District', name: 'district', placeholder: 'e.g. Madurai', type: 'text' },
    { icon: <User size={14} color="#3A67B1" />, label: 'Chairman Name', name: 'chairmanName', placeholder: 'e.g. Rajesh Kumar', type: 'text' },
    { icon: <Calendar size={14} color="#3A67B1" />, label: 'Plan Expiry Date', name: 'planExpiryDate', placeholder: '', type: 'date' },
  ];

  return (
    <div className="my-tables-page-container" style={{ background: '#F2F4F9', minHeight: '100vh', fontFamily: "'Roboto', sans-serif" }}>
      <style>{`
        .my-tables-page-container { padding: 50px 20px 80px; }
        .form-grid-2col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .tables-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 22px; }
        .form-card { padding: 36px 40px; }

        /* Modal overlay */
        .modal-overlay { padding: 20px; }
        .modal-inner { width: 100%; max-width: 640px; border-radius: 20px; max-height: 90vh; overflow-y: auto; }

        /* Created member card - fix button overlap */
        .member-list-item { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .member-list-item-info { flex: 1; min-width: 0; }
        .member-list-item-info .name { font-weight: 700; color: #1a1a2e; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .member-list-item-info .sub { font-size: 12px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .add-to-table-btn { flex-shrink: 0; background: #3A67B1; color: #fff; border-radius: 8px; padding: 7px 14px; font-size: 12px; font-weight: 700; border: none; cursor: pointer; white-space: nowrap; }
        .add-to-table-btn:hover { background: #1c407d; }

        @media (max-width: 768px) {
          .my-tables-page-container { padding: 20px 12px 50px; }
          .form-grid-2col { grid-template-columns: 1fr; }
          .tables-grid { grid-template-columns: 1fr; }
          .form-card { padding: 18px 16px; }
          .page-title { font-size: 24px !important; }
          .page-sub { font-size: 14px !important; }

          /* Modal full-screen on mobile */
          .modal-overlay { padding: 0 !important; align-items: flex-end !important; }
          .modal-inner { max-width: 100% !important; border-radius: 20px 20px 0 0 !important; max-height: 92vh; }

          /* Member card on mobile - stack vertically */
          .member-list-item { flex-wrap: wrap; gap: 10px; }
          .member-list-item .member-avatar { width: 36px !important; height: 36px !important; font-size: 14px !important; }
          .add-to-table-btn { width: 100%; text-align: center; padding: 10px; }

          /* Table card action buttons */
          .card-actions { flex-direction: column !important; }
          .card-actions button:first-child { width: 100%; }
          .card-actions button:last-child { width: 100%; height: 40px; }
        }

        @media (max-width: 400px) {
          .my-tables-page-container { padding: 16px 10px 40px; }
          .form-card { padding: 14px 12px; }
        }
      `}</style>

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,20,50,0.85)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '20px', color: '#1a1a2e' }}>{confirmModal.title}</h3>
            <p style={{ margin: '0 0 24px', fontSize: '15px', color: '#666', lineHeight: '1.5' }}>{confirmModal.message}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={cancelConfirm} style={{ padding: '10px 18px', background: '#f5f7fa', color: '#444', border: '1px solid #dcdfe6', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
              <button onClick={handleConfirmAction} style={{ padding: '10px 18px', background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Page Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#3A67B1', margin: '0 0 10px' }}>My Tables Management</h1>
          <p style={{ fontSize: '16px', color: '#64666A', margin: 0 }}>
            Create and manage your chapter networks. Click a card to add new members.
          </p>
        </div>

        {/* ── Create Table Form ── */}
        <div className="form-card" style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 6px 24px rgba(58,103,177,0.09)', marginBottom: '56px', border: '1px solid #E8EDF5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', borderBottom: '2px solid #EEF2FF', paddingBottom: '18px' }}>
            <PlusCircle color="#3A67B1" size={26} />
            <h2 style={{ fontSize: '21px', fontWeight: '800', color: '#1a1a2e', margin: 0 }}>Create a New Table</h2>
          </div>

          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FFCDD2', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#C62828', fontSize: '14px' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2col">
              {formFields.map(f => (
                <div key={f.name}>
                  <label style={labelStyle}>{f.icon} {f.label}</label>
                  <input {...fieldInput(f.name, formData[f.name], f.placeholder, f.type)} />
                </div>
              ))}
            </div>

            {/* Create Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '15px 52px',
                  background: isLoading ? '#9CB8E8' : 'linear-gradient(90deg, #3A67B1 0%, #1c407d 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '17px',
                  fontWeight: '700',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: isLoading ? 'none' : '0 8px 22px rgba(58,103,177,0.32)',
                  transition: 'all 0.28s ease',
                  letterSpacing: '0.2px'
                }}
                onMouseEnter={e => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 14px 32px rgba(58,103,177,0.42)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 22px rgba(58,103,177,0.32)';
                }}
              >
                <PlusCircle size={21} />
                {isLoading ? 'Creating...' : 'Create Table'}
              </button>
            </div>
          </form>
        </div>

        {/* ── Tables Grid ── */}
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
        {!isFetching && tablesList.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '26px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1a1a2e', margin: 0 }}>Active Tables</h3>
              <span style={{
                background: 'linear-gradient(90deg, #3A67B1 0%, #1c407d 100%)',
                color: '#fff', borderRadius: '50px',
                padding: '3px 14px', fontSize: '14px', fontWeight: '700'
              }}>{tablesList.length}</span>
            </div>

            <div className="tables-grid">
              {tablesList.map((table, i) => {
                const tId = table.id || table.chapterName;
                const membersCount = networkMembersCount[tId] || 0;

                // Calculate dynamic stats for this table
                const tableConnects = networkConnectsCount[tId] !== undefined
                  ? networkConnectsCount[tId]
                  : allConnects.filter(c => String(c.tableId) === String(tId)).length;

                const tableGnotesTotal = networkGnotesTotal[tId] !== undefined
                  ? networkGnotesTotal[tId]
                  : allGnotes
                    .filter(g => String(g.tableId) === String(tId))
                    .reduce((sum, g) => sum + Number(g.amount || 0), 0);

                let displayGnotes = `₹ ${tableGnotesTotal}`;
                if (tableGnotesTotal >= 1000) displayGnotes = `₹ ${(tableGnotesTotal / 1000).toFixed(1)} K`;

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
                      cursor: 'pointer',
                      boxShadow: hoveredCard === i ? '0 18px 40px rgba(58,103,177,0.2)' : '0 4px 16px rgba(58,103,177,0.07)',
                      transform: hoveredCard === i ? 'translateY(-7px) scale(1.01)' : 'translateY(0) scale(1)',
                      transition: 'all 0.32s cubic-bezier(0.34,1.56,0.64,1)'
                    }}
                  >
                    {/* Card Header (1st Design) */}
                    <div style={{
                      background: 'linear-gradient(135deg, #3A67B1 0%, #1c407d 100%)',
                      padding: '22px 20px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                      <div style={{ position: 'absolute', bottom: '-10px', right: '30px', width: '55px', height: '55px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                      <h4 style={{ margin: '0 0 6px', fontSize: '19px', fontWeight: '800', color: '#fff', position: 'relative' }}>{table.name || table.chapterName}</h4>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.82)', position: 'relative' }}>
                        Chairman: <strong style={{ color: '#fff' }}>{table.chairman_name || table.chairmanName}</strong>
                      </span>
                    </div>

                    {/* Card Body (With new content fields) */}
                    <div style={{ padding: '18px 20px' }}>
                      {[
                        { icon: <Navigation size={15} color="#3A67B1" />, label: 'Zone', val: table.zone || 'Zone 001' },
                        { icon: <Users size={15} color="#3A67B1" />, label: 'Members', val: membersCount },
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

                      <div className="card-actions" style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedTable(table); fetchMemberList(); fetchNetworkMembers(tId); }}
                          style={{ flex: 1, background: '#3A67B1', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                          <User size={16} /> Manage Users
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteTable(tId); }}
                          style={{ minWidth: '44px', background: '#fdf0ef', color: '#d32f2f', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ── Manage Users Modal ── */}
      {selectedTable && (() => {
        const tableId = selectedTable.id || selectedTable.name || selectedTable.chapterName;
        const tableName = selectedTable.name || selectedTable.chapterName;
        const addedMembers = networkMembers;
        return (
          <div
            onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(10,20,50,0.85)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              zIndex: 3000, padding: '20px'
            }}
          >
            <div style={{
              background: '#fff',
              borderRadius: '20px',
              width: '100%', maxWidth: '580px',
              boxShadow: '0 30px 70px rgba(0,0,0,0.28)',
              overflow: 'hidden',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Modal Header */}
              <div style={{
                background: 'linear-gradient(135deg, #3A67B1 0%, #1c407d 100%)',
                padding: '20px 24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexShrink: 0
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#fff' }}>Manage Users</h3>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>
                    Table: {tableName}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>

                {/* Create Member Form */}
                <div style={{ background: '#F8FAFF', border: '1px solid #E3EAF5', borderRadius: '14px', padding: '22px', marginBottom: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #EEF2FF' }}>
                    <UserPlus size={18} color="#3A67B1" />
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>Create New Member</h4>
                  </div>

                  {memberFormError && (
                    <div style={{ background: '#FFF0F0', border: '1px solid #FFCDD2', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', color: '#C62828', fontSize: '13px' }}>
                      ⚠️ {memberFormError}
                    </div>
                  )}

                  <form onSubmit={handleCreateMember}>
                    <div className="form-grid-2col">
                      {[
                        { icon: <User size={14} color="#3A67B1" />, label: 'Full Name', name: 'fullName', placeholder: 'Enter full name', type: 'text' },
                        { icon: <Briefcase size={14} color="#3A67B1" />, label: 'Business Name', name: 'businessName', placeholder: 'Enter business name', type: 'text' },
                        { icon: <CreditCard size={14} color="#3A67B1" />, label: 'Membership ID', name: 'membershipId', placeholder: 'e.g. SBN-2024-001', type: 'text' },
                        { icon: <Phone size={14} color="#3A67B1" />, label: 'Mobile Number (Login ID)', name: 'mobile', placeholder: '+91 98765 43210', type: 'tel' },
                      ].map(f => (
                        <div key={f.name} style={{ marginBottom: '14px' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            {f.icon} {f.label}
                          </label>
                          <input
                            type={f.type}
                            value={memberForm[f.name]}
                            onChange={e => setMemberForm(prev => ({ ...prev, [f.name]: e.target.value }))}
                            placeholder={f.placeholder}
                            style={{ width: '100%', padding: '11px 14px', borderRadius: '9px', border: '1.5px solid #D8E0F0', fontSize: '14px', outline: 'none', color: '#111', background: '#fff', boxSizing: 'border-box', fontFamily: 'inherit' }}
                            onFocus={e => { e.target.style.borderColor = '#3A67B1'; e.target.style.boxShadow = '0 0 0 3px rgba(58,103,177,0.12)'; }}
                            onBlur={e => { e.target.style.borderColor = '#D8E0F0'; e.target.style.boxShadow = 'none'; }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Password field */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        <Lock size={14} color="#3A67B1" /> Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={memberForm.password}
                          onChange={e => setMemberForm(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Set a password"
                          style={{ width: '100%', padding: '11px 50px 11px 14px', borderRadius: '9px', border: '1.5px solid #D8E0F0', fontSize: '14px', outline: 'none', color: '#111', background: '#fff', boxSizing: 'border-box', fontFamily: 'inherit' }}
                          onFocus={e => { e.target.style.borderColor = '#3A67B1'; e.target.style.boxShadow = '0 0 0 3px rgba(58,103,177,0.12)'; }}
                          onBlur={e => { e.target.style.borderColor = '#D8E0F0'; e.target.style.boxShadow = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(p => !p)}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#3A67B1', fontSize: '11px', fontWeight: '700' }}
                        >
                          {showPassword ? 'HIDE' : 'SHOW'}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '13px',
                        background: 'linear-gradient(90deg, #3A67B1 0%, #1c407d 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 6px 16px rgba(58,103,177,0.28)',
                        letterSpacing: '0.2px'
                      }}
                    >
                      <UserPlus size={17} /> Create Member
                    </button>
                  </form>
                </div>

                {/* Created Members - Pending Add */}
                {createdMembers.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1a1a2e' }}>Created Members</h4>
                      <span style={{ background: '#FFF3CD', color: '#856404', fontSize: '11px', fontWeight: '700', padding: '2px 10px', borderRadius: '50px' }}>
                        Click to add to table
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {createdMembers
                        .filter(m => !networkMembers.some(nm => nm.id === m.id || nm.mobile === m.mobile || nm.mobile_number === m.mobile))
                        .map(m => (
                          <div
                            key={m.id}
                            className="member-list-item"
                            onClick={() => handleAddToTable(m)}
                            style={{
                              position: 'relative',
                              background: '#fff',
                              border: '2px dashed #3A67B1',
                              borderRadius: '12px',
                              padding: '14px 16px',
                              paddingRight: '42px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '12px',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                              <div className="member-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #3A67B1, #1c407d)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>
                                {m.fullName[0].toUpperCase()}
                              </div>
                              <div className="member-list-item-info">
                                <div className="name">{m.fullName}</div>
                                <div className="sub">{m.businessName && <span style={{ marginRight: '8px' }}>{m.businessName}</span>}{m.mobile}</div>
                                {m.membershipId && <div style={{ fontSize: '11px', color: '#3A67B1', fontWeight: '600', marginTop: '2px' }}>ID: {m.membershipId}</div>}
                              </div>
                            </div>
                            
                            <div className="member-actions-wrapper" style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center', marginLeft: 'auto' }}>
                              <button className="add-to-table-btn" disabled={addingMemberId === m.id} onClick={e => { e.stopPropagation(); handleAddToTable(m); }} style={{ flexShrink: 0, opacity: addingMemberId === m.id ? 0.7 : 1 }}>
                                {addingMemberId === m.id ? 'Adding...' : '+ Add to Table'}
                              </button>
                              
                              <button
                                className="delete-member-btn"
                                onClick={e => {
                                  e.stopPropagation();
                                  setConfirmModal({
                                    isOpen: true,
                                    type: 'member',
                                    tableId: tableId,
                                    userId: m.id,
                                    title: 'Delete Member',
                                    message: `Are you sure you want to permanently delete ${m.fullName}? This cannot be undone.`
                                  });
                                }}
                                style={{ padding: '7px 10px', background: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: '8px', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Already Added Members */}
                {loadingNetworkMembers && <div style={{ padding: '20px', textAlign: 'center', color: '#3A67B1', fontWeight: 'bold' }}>Loading Members...</div>}
                {!loadingNetworkMembers && addedMembers.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <Users size={16} color="#3A67B1" />
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1a1a2e' }}>Table Members ({addedMembers.length})</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {addedMembers.map(u => (
                        <div
                          key={u.id}
                          className="table-member-item"
                          style={{ 
                            position: 'relative',
                            background: '#F8FAFF', 
                            border: '1px solid #E3EAF5', 
                            borderRadius: '12px', 
                            padding: '14px 16px',
                            paddingRight: '42px', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            flexWrap: 'wrap', 
                            gap: '10px' 
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #43a047, #2e7d32)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '15px', flexShrink: 0 }}>
                              {(u.fullName || u.name || '?')[0].toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '14px' }}>{u.fullName || u.name}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>{u.businessName && <span style={{ marginRight: '10px' }}>{u.businessName}</span>}{u.mobile}</div>
                              {u.membershipId && <div style={{ fontSize: '11px', color: '#2e7d32', fontWeight: '600', marginTop: '2px' }}>ID: {u.membershipId}</div>}
                            </div>
                          </div>
                          <button
                            className="delete-member-btn"
                            onClick={() => setConfirmModal({
                              isOpen: true,
                              type: 'member',
                              tableId: tableId,
                              userId: u.id,
                              title: 'Remove Member',
                              message: `Are you sure you want to remove ${u.fullName || u.name} from this table?`
                            })}
                            style={{ minWidth: '36px', height: '36px', padding: '0', background: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginLeft: 'auto' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {addedMembers.length === 0 && createdMembers.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#aaa', fontStyle: 'italic', fontSize: '14px' }}>
                    No members in this table yet. Create one above.
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
