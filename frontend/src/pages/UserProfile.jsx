import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { ToastContext } from '../context/ToastContext.jsx';
import { FaUser, FaCamera, FaSave, FaEnvelope } from 'react-icons/fa';

const UserProfile = () => {
  const { user, updateProfile, updateProfileImage } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || '',
    password: '',
  });

  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size and type
    if (!file.type.match('image.*')) {
      return showToast('Please select an image file (png, jpg, jpeg, webp)', 'warning');
    }

    if (file.size > 5 * 1024 * 1024) {
      return showToast('Image file size must be less than 5MB', 'warning');
    }

    const data = new FormData();
    data.append('image', file);

    try {
      setUploading(true);
      await updateProfileImage(data);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      return showToast('Name is required', 'warning');
    }

    const payload = {
      name: formData.name,
      phone: formData.phone,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
    };

    if (formData.password) {
      if (formData.password.length < 6) {
        return showToast('New password must be at least 6 characters', 'warning');
      }
      payload.password = formData.password;
    }

    const res = await updateProfile(payload);
    if (res.success) {
      setFormData((prev) => ({ ...prev, password: '' })); // clear password input
    }
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h4 className="display-font fw-bold">Please log in to view your profile</h4>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="display-font fw-bold mb-4">My Profile</h2>

      <div className="row g-4">
        {/* Left Column: Avatar & Summary card */}
        <div className="col-lg-4">
          <div className="card border-0 glass-panel p-4 rounded-4 text-center">
            {/* Avatar Wrap */}
            <div className="position-relative d-inline-block mx-auto mb-4" style={{ width: '130px', height: '130px' }}>
              <img 
                src={user.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'} 
                alt={user.name} 
                className="rounded-circle border border-4 border-primary img-fluid w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
              <label 
                htmlFor="avatarInput" 
                className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center position-absolute shadow-sm"
                style={{
                  width: '38px',
                  height: '38px',
                  bottom: '0',
                  right: '0',
                  cursor: 'pointer',
                  border: '3px solid hsl(var(--bg-card))'
                }}
                title="Change Avatar"
              >
                {uploading ? (
                  <span className="spinner-border spinner-border-sm text-light" role="status"></span>
                ) : (
                  <FaCamera />
                )}
                <input 
                  type="file" 
                  id="avatarInput" 
                  className="d-none" 
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  disabled={uploading}
                />
              </label>
            </div>

            <h4 className="fw-bold mb-1 display-font text-dark">{user.name}</h4>
            <span className="text-muted d-block mb-3" style={{ fontSize: '0.85rem' }}>
              <FaEnvelope className="me-2 text-primary" />{user.email}
            </span>
            <span className="badge bg-primary text-uppercase px-3 py-1.5 rounded-pill" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
              {user.role} account
            </span>
          </div>
        </div>

        {/* Right Column: Address & details fields */}
        <div className="col-lg-8">
          <div className="card border-0 glass-panel p-4 rounded-4">
            <h5 className="fw-bold mb-4 display-font border-bottom border-light pb-2">Profile Details</h5>

            <form onSubmit={handleSubmitDetails}>
              {/* Basic Fields */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-control custom-input" 
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nikhil Ravva"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Email Address (Unchangeable)</label>
                  <input 
                    type="email" 
                    className="form-control custom-input" 
                    value={user.email}
                    disabled
                    style={{ opacity: 0.6 }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Phone Number</label>
                  <input 
                    type="text" 
                    name="phone" 
                    className="form-control custom-input" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 0123"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>New Password (Leave blank to keep current)</label>
                  <input 
                    type="password" 
                    name="password" 
                    className="form-control custom-input" 
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              {/* Address Fields */}
              <h6 className="fw-bold display-font border-bottom border-light pb-2 mb-3">Shipping Address</h6>
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Street Address</label>
                  <input 
                    type="text" 
                    name="street" 
                    className="form-control custom-input" 
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>City</label>
                  <input 
                    type="text" 
                    name="city" 
                    className="form-control custom-input" 
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>State / Province</label>
                  <input 
                    type="text" 
                    name="state" 
                    className="form-control custom-input" 
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Postal Code / ZIP</label>
                  <input 
                    type="text" 
                    name="zip" 
                    className="form-control custom-input" 
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="10001"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Country</label>
                  <input 
                    type="text" 
                    name="country" 
                    className="form-control custom-input" 
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="USA"
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="btn btn-primary-glow px-4 py-2.5 d-flex align-items-center gap-2">
                <FaSave /> Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
