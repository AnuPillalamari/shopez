import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrashAlt, FaImage } from 'react-icons/fa';
import { ToastContext } from '../../context/ToastContext.jsx';

const ManageCategories = () => {
  const { showToast } = useContext(ToastContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (err) {
      showToast('Failed to load categories', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedCat(null);
    setFormData({ name: '', description: '' });
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setSelectedCat(cat);
    setFormData({ name: cat.name, description: cat.description || '' });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return showToast('Category name is required', 'warning');

    setSaving(true);
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('description', formData.description);
    if (imageFile) payload.append('image', imageFile);

    try {
      if (isEditing) {
        await axios.put(`/api/categories/${selectedCat._id}`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Category updated', 'success');
      } else {
        await axios.post('/api/categories', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Category created', 'success');
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Products in this category will have no category.`)) return;
    try {
      await axios.delete(`/api/categories/${id}`);
      showToast('Category deleted', 'success');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'danger');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <h3 className="display-font fw-bold mb-0">Manage Categories</h3>
        <button onClick={openCreateModal} className="btn btn-primary-glow d-flex align-items-center gap-2 px-3 py-2">
          <FaPlus /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="row g-3">
          {[1,2,3,4].map(n => <div key={n} className="col-md-3"><div className="skeleton" style={{ height: '180px' }}></div></div>)}
        </div>
      ) : (
        <div className="row g-3">
          {categories.map(cat => (
            <div key={cat._id} className="col-sm-6 col-md-4 col-lg-3">
              <div className="card border-0 glass-panel rounded-4 overflow-hidden h-100 custom-card">
                <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: '130px' }}>
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  ) : (
                    <FaImage className="text-muted fs-2" />
                  )}
                </div>
                <div className="p-3">
                  <h6 className="fw-bold mb-1 text-capitalize">{cat.name}</h6>
                  <p className="text-muted mb-3" style={{ fontSize: '0.8rem', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {cat.description || 'No description provided.'}
                  </p>
                  <div className="d-flex gap-2">
                    <button onClick={() => openEditModal(cat)} className="btn btn-outline-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1" style={{ borderRadius: '8px', fontSize: '0.78rem' }}>
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="btn btn-outline-danger btn-sm flex-fill d-flex align-items-center justify-content-center gap-1" style={{ borderRadius: '8px', fontSize: '0.78rem' }}>
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-12 text-center py-5 text-muted">No categories found. Create one!</div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content rounded-4 border-0" style={{ backgroundColor: 'hsl(var(--bg-card))' }}>
              <div className="modal-header border-bottom border-light px-4 py-3">
                <h5 className="modal-title fw-bold display-font">{isEditing ? 'Edit Category' : 'Add Category'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body px-4 py-3">
                  <div className="d-flex flex-column gap-3">
                    <div>
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Category Name</label>
                      <input type="text" className="form-control custom-input" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Description (optional)</label>
                      <textarea className="form-control custom-input" rows="3" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}></textarea>
                    </div>
                    <div>
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Category Image</label>
                      <input type="file" accept="image/*" className="form-control custom-input" onChange={e => setImageFile(e.target.files[0])} />
                      {isEditing && selectedCat?.image && (
                        <div className="mt-2">
                          <img src={selectedCat.image} alt="" className="rounded-3" style={{ height: '60px', objectFit: 'cover' }} />
                          <small className="text-muted ms-2">Current image. Upload new to replace.</small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top border-light px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary px-4" style={{ borderRadius: '10px' }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary-glow px-4" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm"></span> : (isEditing ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
