import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaUserShield, FaUser, FaSearch } from 'react-icons/fa';
import { ToastContext } from '../../context/ToastContext.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';

const ManageUsers = () => {
  const { showToast } = useContext(ToastContext);
  const { user: currentAdmin } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/admin/users');
      setUsers(data);
    } catch (err) {
      showToast('Failed to load users', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { data } = await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: data.role } : u));
      showToast(`User role updated to ${newRole}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Role update failed', 'danger');
    }
  };

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      showToast('User deleted successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'danger');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <h3 className="display-font fw-bold mb-0">Manage Users</h3>
        <span className="text-muted">{users.length} registered accounts</span>
      </div>

      {/* Search */}
      <div className="card border-0 glass-panel p-3 rounded-4 mb-4">
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0 text-muted" style={{ border: '1px solid hsl(var(--border))', borderRadius: '10px 0 0 10px' }}>
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control custom-input border-start-0"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ borderRadius: '0 10px 10px 0' }}
          />
        </div>
      </div>

      <div className="card border-0 glass-panel rounded-4 overflow-hidden">
        {loading ? (
          <div className="p-4">
            {[1,2,3,4].map(n => <div key={n} className="skeleton mb-3" style={{ height: '60px' }}></div>)}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0" style={{ fontSize: '0.88rem' }}>
              <thead style={{ backgroundColor: 'hsl(var(--bg-input))' }}>
                <tr className="text-muted text-uppercase border-bottom" style={{ fontSize: '0.7rem' }}>
                  <th className="py-3 px-4 fw-semibold">User</th>
                  <th className="py-3 fw-semibold">Phone</th>
                  <th className="py-3 fw-semibold">Joined</th>
                  <th className="py-3 fw-semibold">Role</th>
                  <th className="py-3 pe-4 fw-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u._id} className="border-bottom border-light">
                    <td className="py-3 px-4">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=60'}
                          alt=""
                          className="rounded-circle border"
                          style={{ width: '38px', height: '38px', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <div>
                          <span className="fw-semibold d-block">{u.name}</span>
                          <span className="text-muted" style={{ fontSize: '0.78rem' }}>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-muted">{u.phone || '—'}</td>
                    <td className="py-3 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      {u._id === currentAdmin?._id ? (
                        <span className="badge bg-primary rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>admin (you)</span>
                      ) : (
                        <select
                          className="form-select form-select-sm custom-input py-1"
                          value={u.role}
                          onChange={e => handleRoleChange(u._id, e.target.value)}
                          style={{ width: '100px', fontSize: '0.8rem', borderRadius: '8px' }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="py-3 pe-4 text-end">
                      {u._id !== currentAdmin?._id && (
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1 px-2 py-1"
                          style={{ borderRadius: '8px', fontSize: '0.78rem' }}
                        >
                          <FaTrashAlt /> Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-5 text-muted">No users match your search</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
