import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Table, Link2, FileText } from 'lucide-react';

export default function MemberSidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/my-tables', label: 'My Tables', icon: Table },
    { path: '/connect', label: 'Connect', icon: Link2 },
    { path: '/gnote', label: 'G-Note', icon: FileText },
  ];

  return (
    <>
      <style>{`
        .member-sidebar {
          position: sticky;
          top: 130px;
          height: calc(100vh - 130px);
          width: 250px;
          min-width: 250px;
          background: #ffffff;
          box-shadow: 4px 0 24px rgba(0,0,0,0.03);
          z-index: 40;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-right: 1px solid rgba(0,0,0,0.04);
        }
        
        .member-sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          color: #64748b;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .member-sidebar-link:hover {
          background: #f8fafc;
          color: #334155;
          transform: translateX(4px);
        }
        
        .member-sidebar-link.active {
          background: linear-gradient(135deg, rgba(58,103,177,0.1), rgba(237,190,56,0.1));
          color: #3a67b1;
          box-shadow: inset 3px 0 0 #3a67b1;
        }
        
        .member-sidebar-link svg {
          width: 20px;
          height: 20px;
          transition: transform 0.25s ease;
        }
        
        .member-sidebar-link:hover svg {
          transform: scale(1.1);
        }
        
        .member-sidebar-link.active svg {
          color: #3a67b1;
        }
        
        @media (max-width: 968px) {
          .member-sidebar {
            display: none; /* Hide sidebar on mobile, top navbar handles it */
          }
        }
      `}</style>
      <aside className="member-sidebar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`member-sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon />
              {item.label}
            </Link>
          );
        })}
      </aside>
    </>
  );
}
