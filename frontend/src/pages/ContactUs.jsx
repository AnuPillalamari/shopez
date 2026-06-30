import React, { useState, useContext } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaClock } from 'react-icons/fa';
import { ToastContext } from '../context/ToastContext.jsx';

const ContactUs = () => {
  const { showToast } = useContext(ToastContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return showToast('Please fill in all form fields', 'warning');
    }

    showToast(`Thank you, ${formData.name}! Support staff has received your message.`, 'success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container py-5">
      {/* Title */}
      <div className="text-center mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <span className="badge bg-primary rounded-pill px-3 py-1.5 text-uppercase mb-2 fw-semibold" style={{ fontSize: '0.7rem' }}>Get in Touch</span>
        <h2 className="display-font fw-extrabold display-4 mb-3">Contact Support</h2>
        <p className="text-muted lead">Have a question about orders, shipping, or refunds? Reach out to us anytime.</p>
      </div>

      <div className="row g-5">
        {/* Left Column: Form */}
        <div className="col-lg-7">
          <div className="card border-0 glass-panel p-4 rounded-4">
            <h5 className="fw-bold mb-4 display-font border-bottom border-light pb-2">Send Us a Message</h5>
            
            <form onSubmit={handleFormSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Your Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="form-control custom-input" 
                    placeholder="Rahul Sharma" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-control custom-input" 
                    placeholder="email@example.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    className="form-control custom-input" 
                    placeholder="Order tracking query" 
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Message Details</label>
                  <textarea 
                    name="message"
                    className="form-control custom-input" 
                    rows="5"
                    placeholder="Tell us details about your concern..." 
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary-glow px-4 py-2.5 d-flex align-items-center gap-2">
                    <FaPaperPlane /> Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Info blocks */}
        <div className="col-lg-5">
          <div className="card border-0 glass-panel p-4 rounded-4 h-100 justify-content-between">
            <div>
              <h5 className="fw-bold mb-4 display-font border-bottom border-light pb-2">Support Channels</h5>
              
              <div className="d-flex flex-column gap-4">
                {/* Channel 1 */}
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-light p-2.5 rounded-3 text-primary border" style={{ fontSize: '1.2rem' }}>
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Phone Line</h6>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>+91 9876543210</span>
                  </div>
                </div>

                {/* Channel 2 */}
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-light p-2.5 rounded-3 text-primary border" style={{ fontSize: '1.2rem' }}>
                    <FaEnvelope />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Email Support</h6>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>support@shopez.com</span>
                  </div>
                </div>

                {/* Channel 3 */}
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-light p-2.5 rounded-3 text-primary border" style={{ fontSize: '1.2rem' }}>
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Headquarters</h6>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>Hyderabad, Telangana, India</span>
                  </div>
                </div>

                {/* Channel 4 */}
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-light p-2.5 rounded-3 text-primary border" style={{ fontSize: '1.2rem' }}>
                    <FaClock />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Working Hours</h6>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>Mon - Fri: 9:00 AM - 6:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual enhancement map placeholder */}
            <div className="bg-light border rounded-4 text-center py-4 mt-4" style={{ borderStyle: 'dashed' }}>
              <span className="text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>GOOGLE MAP NOTIFICATION PORT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
