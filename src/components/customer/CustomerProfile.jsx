import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Navbar from '../common/Navbar';
import { User, Mail, Phone, MapPin, Calendar, Save, Edit2 } from 'lucide-react';

export default function CustomerProfile() {
  const { user, updateCustomer } = useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    location: user?.location || '',
  });

  const handleSave = () => {
    updateCustomer(form);
    addToast('Profile updated successfully!', 'success');
    setEditing(false);
  };

  const avatarUrl = user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=4F46E5&color=fff&size=200`;

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-header">
        <div className="container">
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>
      </div>

      <div className="container-narrow" style={{ paddingTop: 8, paddingBottom: 48 }}>
        <div className="card">
          {/* Profile Header */}
          <div style={{ background: 'linear-gradient(135deg, #EEF2FF, #DDD6FE)', padding: '32px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <img
              src={avatarUrl}
              alt={user?.fullName}
              style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: 'var(--shadow-md)' }}
            />
            <div>
              <h2 style={{ marginBottom: 4 }}>{user?.fullName}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <Calendar size={14} />
                Member since {new Date(user?.joinedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              {!editing ? (
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                  <Edit2 size={14} /> Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary btn-sm" onClick={handleSave}>
                    <Save size={14} /> Save
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Fields */}
              {[
                { icon: <User size={18} />, label: 'Full Name', key: 'fullName', type: 'text' },
                { icon: <Mail size={18} />, label: 'Email', key: 'email', type: 'email' },
                { icon: <Phone size={18} />, label: 'Mobile', key: 'mobile', type: 'tel' },
                { icon: <MapPin size={18} />, label: 'Address', key: 'address', type: 'text' },
                { icon: <MapPin size={18} />, label: 'City / Location', key: 'location', type: 'text' },
              ].map((field) => (
                <div key={field.key} style={{ display: 'flex', gap: 16, alignItems: editing ? 'flex-start' : 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    {field.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: editing ? 6 : 2 }}>
                      {field.label}
                    </div>
                    {editing ? (
                      <input
                        className="form-input"
                        type={field.type}
                        value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      />
                    ) : (
                      <div style={{ fontWeight: 500 }}>{user?.[field.key] || '—'}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', fontSize: '0.85rem' }}>
        © 2024 Vendour-Mart
      </footer>
    </div>
  );
}
