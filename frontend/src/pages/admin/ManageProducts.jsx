import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrashAlt, FaSearch, FaImage } from 'react-icons/fa';
import { ToastContext } from '../../context/ToastContext.jsx';

const ManageProducts = () => {
  const { showToast } = useContext(ToastContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', discountPrice: '',
    category: '', brand: '', stock: '', featured: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async (kw = '', pg = 1) => {
    try {
      setLoading(true);
      const params = { limit: 10, page: pg };
      if (kw) params.keyword = kw;
      const { data } = await axios.get('/api/products', { params });
      setProducts(data.products);
      setPages(data.pages);
    } catch (err) {
      showToast('Failed to load products', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchKeyword, 1);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  useEffect(() => {
    fetchProducts(searchKeyword, page);
  }, [page]);

  const openCreateModal = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    setFormData({ name: '', description: '', price: '', discountPrice: '', category: '', brand: '', stock: '', featured: false });
    setImageFiles([]);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || '',
      category: product.category?._id || '',
      brand: product.brand,
      stock: product.stock,
      featured: product.featured,
    });
    setImageFiles([]);
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
    imageFiles.forEach(file => payload.append('images', file));

    try {
      if (isEditing) {
        await axios.put(`/api/products/${selectedProduct._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Product updated successfully', 'success');
      } else {
        await axios.post('/api/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Product created successfully', 'success');
      }
      setShowModal(false);
      fetchProducts(searchKeyword, page);
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"?`)) return;
    try {
      await axios.delete(`/api/products/${id}`);
      showToast('Product deleted', 'success');
      fetchProducts(searchKeyword, page);
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'danger');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <h3 className="display-font fw-bold mb-0">Manage Products</h3>
        <button onClick={openCreateModal} className="btn btn-primary-glow d-flex align-items-center gap-2 px-3 py-2">
          <FaPlus /> Add Product
        </button>
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
            placeholder="Search products by name, brand..."
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            style={{ borderRadius: '0 10px 10px 0' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 glass-panel rounded-4 overflow-hidden">
        {loading ? (
          <div className="p-4">
            {[1,2,3].map(n => <div key={n} className="skeleton mb-3" style={{ height: '50px' }}></div>)}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0" style={{ fontSize: '0.88rem' }}>
              <thead style={{ backgroundColor: 'hsl(var(--bg-input))' }}>
                <tr className="text-muted text-uppercase border-bottom" style={{ fontSize: '0.7rem' }}>
                  <th className="py-3 px-4 fw-semibold">Product</th>
                  <th className="py-3 fw-semibold">Category</th>
                  <th className="py-3 fw-semibold">Price</th>
                  <th className="py-3 fw-semibold">Stock</th>
                  <th className="py-3 fw-semibold">Featured</th>
                  <th className="py-3 pe-4 fw-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod._id} className="border-bottom border-light">
                    <td className="py-3 px-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-light rounded-2 overflow-hidden d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
                          {prod.images?.[0] ? (
                            <img src={prod.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <FaImage className="text-muted" />
                          )}
                        </div>
                        <div>
                          <span className="fw-semibold d-block text-capitalize text-truncate" style={{ maxWidth: '180px' }}>{prod.name}</span>
                          <span className="text-muted text-uppercase" style={{ fontSize: '0.72rem' }}>{prod.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-capitalize text-muted">{prod.category?.name || '—'}</td>
                    <td className="py-3">
                      {prod.discountPrice > 0 ? (
                        <div>
                          <span className="fw-bold text-danger d-block">${prod.discountPrice}</span>
                          <span className="text-decoration-line-through text-muted" style={{ fontSize: '0.78rem' }}>${prod.price}</span>
                        </div>
                      ) : (
                        <span className="fw-bold">${prod.price}</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`badge rounded-pill px-2 py-1 ${prod.stock < 10 ? 'bg-warning text-dark' : 'bg-success'}`} style={{ fontSize: '0.75rem' }}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="py-3">
                      {prod.featured ? (
                        <span className="badge bg-primary rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>Yes</span>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>No</span>
                      )}
                    </td>
                    <td className="py-3 pe-4 text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button onClick={() => openEditModal(prod)} className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 px-2 py-1" style={{ borderRadius: '8px', fontSize: '0.78rem' }}>
                          <FaEdit /> Edit
                        </button>
                        <button onClick={() => handleDelete(prod._id, prod.name)} className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-2 py-1" style={{ borderRadius: '8px', fontSize: '0.78rem' }}>
                          <FaTrashAlt /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Pagination */}
        {pages > 1 && (
          <div className="d-flex justify-content-center gap-2 p-3">
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`btn btn-sm px-3 py-1 ${page === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`} style={{ borderRadius: '8px' }}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={e => e.stopPropagation()}>
            <div className="modal-content rounded-4 border-0" style={{ backgroundColor: 'hsl(var(--bg-card))' }}>
              <div className="modal-header border-bottom border-light px-4 py-3">
                <h5 className="modal-title fw-bold display-font">{isEditing ? 'Edit Product' : 'Add New Product'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body px-4 py-3">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Product Name</label>
                      <input type="text" name="name" className="form-control custom-input" value={formData.name} onChange={handleFormChange} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Description</label>
                      <textarea name="description" className="form-control custom-input" rows="3" value={formData.description} onChange={handleFormChange} required></textarea>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Price ($)</label>
                      <input type="number" name="price" min="0" step="0.01" className="form-control custom-input" value={formData.price} onChange={handleFormChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Discount Price ($, optional)</label>
                      <input type="number" name="discountPrice" min="0" step="0.01" className="form-control custom-input" value={formData.discountPrice} onChange={handleFormChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Category</label>
                      <select name="category" className="form-select custom-input" value={formData.category} onChange={handleFormChange} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Brand</label>
                      <input type="text" name="brand" className="form-control custom-input" value={formData.brand} onChange={handleFormChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Stock Quantity</label>
                      <input type="number" name="stock" min="0" className="form-control custom-input" value={formData.stock} onChange={handleFormChange} required />
                    </div>
                    <div className="col-md-6 d-flex align-items-end">
                      <div className="form-check ms-2 mb-1">
                        <input type="checkbox" name="featured" id="featuredCheck" className="form-check-input" checked={formData.featured} onChange={handleFormChange} />
                        <label htmlFor="featuredCheck" className="form-check-label fw-semibold">Featured Product</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Product Images (up to 5)</label>
                      <input type="file" multiple accept="image/*" className="form-control custom-input" onChange={e => setImageFiles(Array.from(e.target.files))} />
                      {isEditing && <small className="text-muted">Leave blank to keep existing images.</small>}
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top border-light px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary px-4" style={{ borderRadius: '10px' }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary-glow px-4" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm" role="status"></span> : (isEditing ? 'Update Product' : 'Create Product')}
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

export default ManageProducts;
