import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Bell, Check, Package, MessageSquare, AlertTriangle,
  Sparkles, CheckCircle2, Download, ExternalLink, X, ShieldAlert
} from 'lucide-react';

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    pushPermission,
    requestPushPermission,
    isInstallable,
    promptInstallPwa
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const dropRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifs = filter === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const getNotifIcon = (type) => {
    switch (type) {
      case 'order':
      case 'order_new':
      case 'order_status':
        return <Package size={16} color="#6366F1" />;
      case 'message':
        return <MessageSquare size={16} color="#0EA5E9" />;
      case 'low_stock':
      case 'inventory_alert':
        return <AlertTriangle size={16} color="#EF4444" />;
      case 'bundle':
      case 'promotion':
        return <Sparkles size={16} color="#F59E0B" />;
      case 'application':
        return <ShieldAlert size={16} color="#10B981" />;
      default:
        return <Bell size={16} color="var(--primary)" />;
    }
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropRef}>
      <button
        type="button"
        className="nav-icon-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Notifications & Updates"
        style={{ position: 'relative' }}
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            className="nav-badge"
            style={{
              background: '#EF4444',
              color: 'white',
              fontSize: '0.68rem',
              fontWeight: 800,
              minWidth: 18,
              height: 18
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: 360,
            maxWidth: '90vw',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 520
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>Notifications</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: '#FEE2E2',
                    color: '#DC2626',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 20
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div
            style={{
              padding: '8px 16px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface)'
            }}
          >
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={() => setFilter('all')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  background: filter === 'all' ? 'var(--primary)' : 'transparent',
                  color: filter === 'all' ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: 'none',
                  background: filter === 'unread' ? 'var(--primary)' : 'transparent',
                  color: filter === 'unread' ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {pushPermission !== 'granted' && (
              <button
                type="button"
                onClick={requestPushPermission}
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--primary)',
                  background: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                  borderRadius: 6,
                  padding: '3px 8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                🔔 Enable Push
              </button>
            )}
          </div>

          {/* PWA Install Banner */}
          {isInstallable && (
            <div
              style={{
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                borderBottom: '1px solid #C7D2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#312E81' }}>
                📱 Install Vendor Hub app for instant alerts
              </div>
              <button
                type="button"
                onClick={promptInstallPwa}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.72rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Download size={12} /> Install
              </button>
            </div>
          )}

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filteredNotifs.length === 0 ? (
              <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Bell size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No notifications found</div>
                <div style={{ fontSize: '0.75rem', marginTop: 4 }}>You are all caught up!</div>
              </div>
            ) : (
              filteredNotifs.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border)',
                    background: notif.isRead ? 'var(--surface)' : 'rgba(79, 70, 229, 0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = notif.isRead ? 'var(--surface)' : 'rgba(79, 70, 229, 0.04)'; }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--surface-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2
                    }}
                  >
                    {getNotifIcon(notif.type)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: notif.isRead ? 600 : 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                        {notif.title}
                      </span>
                      {!notif.isRead && (
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            flexShrink: 0
                          }}
                        />
                      )}
                    </div>
                    <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {notif.message}
                    </p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
