// src/components/DummyPaymentModal.jsx
import React, { useState } from 'react';
import './DummyPaymentModal.css';

const DummyPaymentModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  details, // An object like { "Movie": "...", "Seats": "...", "Total": "..." }
  submitButtonText = "Confirm Booking",
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!name.trim() || !email.trim()) {
      alert("Please enter your name and email.");
      return;
    }
    if (!email.includes('@')) {
        alert("Please enter a valid email address.");
        return;
    }
    onSubmit({ name, email, ...details }); // Pass form data and original details
  };

  return (
    <div className="dummy-modal-overlay" onClick={onClose}>
      <div className="dummy-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="dummy-modal-close-btn" onClick={onClose}>×</button>
        <h2>{title}</h2>

        {details && (
          <div className="dummy-modal-details-summary">
            {Object.entries(details).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="dummy-booking-form">
          <p>Please enter your details to confirm:</p>
          <div className="form-group">
            <label htmlFor="dummy-name">Name:</label>
            <input
              type="text"
              id="dummy-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="dummy-email">Email:</label>
            <input
              type="email"
              id="dummy-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@example.com"
            />
          </div>
          <button type="submit" className="btn btn-confirm-dummy-booking">
            {submitButtonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DummyPaymentModal;