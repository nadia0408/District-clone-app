// src/components/BookingModal.jsx
import React, { useState } from 'react';
import './BookingModal.css';

const BookingModal = ({ isOpen, onClose, restaurant, onSubmitBooking }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(restaurant?.availability?.slots[0] || '12:00 PM');
  const [guests, setGuests] = useState(2);

  if (!isOpen || !restaurant) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitBooking({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      date,
      time,
      guests,
    });
    onClose(); // Close modal after submission
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2>Book a Table at {restaurant.name}</h2>
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="booking-date">Date:</label>
            <input
              type="date"
              id="booking-date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="booking-time">Time:</label>
            <select
              id="booking-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            >
              {restaurant.availability.slots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="booking-guests">Guests (1-{restaurant.availability.max_guests}):</label>
            <input
              type="number"
              id="booking-guests"
              value={guests}
              min="1"
              max={restaurant.availability.max_guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              required
            />
          </div>
          <button type="submit" className="btn btn-confirm-booking">
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;