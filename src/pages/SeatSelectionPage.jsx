// src/pages/SeatSelectionPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMockSeatLayout } from '../mockData';
import './SeatSelectionPage.css';

const SeatSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // For future navigation to payment
  const { movie, cinema, screen, showtime, date } = location.state || {};

  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]); // Array of seat IDs
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (screen) {
      setSeatLayout(getMockSeatLayout(screen.id));
    }
  }, [screen]);

  useEffect(() => {
    // Calculate total price
    let currentTotal = 0;
    selectedSeats.forEach(seatId => {
      const [rowName, seatNumStr] = [seatId.charAt(0), seatId.substring(1)];
      const row = seatLayout.find(r => r.rowName === rowName);
      const seat = row?.seats.find(s => s.id === seatId);
      if (seat) {
        currentTotal += seat.price;
      }
    });
    setTotalPrice(currentTotal);
  }, [selectedSeats, seatLayout]);

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return; // Can't select booked seats

    setSelectedSeats(prevSelectedSeats => {
      if (prevSelectedSeats.includes(seat.id)) {
        return prevSelectedSeats.filter(sId => sId !== seat.id); // Deselect
      } else {
        if (prevSelectedSeats.length < 10) { // Max 10 seats
            return [...prevSelectedSeats, seat.id]; // Select
        }
        return prevSelectedSeats; // Limit reached
      }
    });
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    console.log("Proceeding to payment with:", {
      movie: movie.title,
      cinema: cinema.name,
      screen: screen.name,
      showtime,
      date,
      seats: selectedSeats,
      totalPrice,
    });
    // **** RAZORPAY INTEGRATION WOULD START HERE ****
    // 1. Call your backend to create a Razorpay order.
    // 2. Your backend returns an order_id.
    // 3. Initialize Razorpay checkout with the order_id and other options.
    alert(`Proceeding to payment for ${selectedSeats.length} seat(s). Total: ₹${totalPrice}. \nRazorpay integration would start now.`);
    // For now, navigate back or to a confirmation (mocked)
    // navigate('/booking-confirmation', { state: { /* booking details */ } });
  };

  if (!movie || !cinema || !screen || !showtime) {
    return (
      <div className="container page-error">
        Booking details are missing. Please start over.
      </div>
    );
  }

  return (
    <div className="container seat-selection-page">
      <h2>Select Seats</h2>
      <div className="booking-summary">
        <p><strong>Movie:</strong> {movie.title}</p>
        <p><strong>Cinema:</strong> {cinema.name} - {screen.name}</p>
        <p><strong>Date & Time:</strong> {new Date(date).toLocaleDateString()} - {showtime}</p>
      </div>

      <div className="screen-area">
        <div className="screen-ui">SCREEN THIS WAY</div>
      </div>

      <div className="seat-map">
        {seatLayout.map((row) => (
          <div key={row.rowName} className="seat-row">
            <span className="row-label">{row.rowName}</span>
            <div className="seats">
              {row.seats.map((seat) => (
                <div
                  key={seat.id}
                  className={`
                    seat
                    ${seat.isBooked ? 'booked' : ''}
                    ${selectedSeats.includes(seat.id) ? 'selected' : ''}
                  `}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat.number}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item"><div className="seat available-legend"></div> Available</div>
        <div className="legend-item"><div className="seat selected-legend"></div> Selected</div>
        <div className="legend-item"><div className="seat booked-legend"></div> Booked</div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="checkout-summary">
          <p>Selected Seats: {selectedSeats.join(', ')}</p>
          <h3>Total Price: ₹{totalPrice.toFixed(2)}</h3>
          <button className="btn proceed-btn" onClick={handleProceedToPayment}>
            Proceed to Pay
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;