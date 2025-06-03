// src/pages/SeatSelectionPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMockSeatLayout } from '../mockData';
import DummyPaymentModal from '../components/DummyPaymentModal'; // Import the new modal
import './SeatSelectionPage.css';

const SeatSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, cinema, screen, showtime, date } = location.state || {};

  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // State for the dummy payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (screen && screen.id) {
      setSeatLayout(getMockSeatLayout(screen.id));
    } else {
      setSeatLayout([]);
    }
  }, [screen]);

  useEffect(() => {
    let currentTotal = 0;
    if (seatLayout.length > 0) {
      selectedSeats.forEach(seatId => {
        const rowName = seatId.charAt(0);
        const row = seatLayout.find(r => r.rowName === rowName);
        const seat = row?.seats.find(s => s.id === seatId);
        if (seat && typeof seat.price === 'number') {
          currentTotal += seat.price;
        }
      });
    }
    setTotalPrice(currentTotal);
  }, [selectedSeats, seatLayout]);

  const handleSeatClick = (seat) => {
    if (!seat || seat.isBooked) return;

    setSelectedSeats(prevSelectedSeats => {
      if (prevSelectedSeats.includes(seat.id)) {
        return prevSelectedSeats.filter(sId => sId !== seat.id);
      } else {
        if (prevSelectedSeats.length < 10) {
          return [...prevSelectedSeats, seat.id];
        }
        alert("You can select a maximum of 10 seats.");
        return prevSelectedSeats;
      }
    });
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    // Open the dummy payment modal instead of Razorpay
    setIsPaymentModalOpen(true);
  };

  const handleDummyPaymentSubmit = (formData) => {
    console.log("Dummy Payment Submitted for Movie Tickets:", {
      ...formData, // Includes name and email from dummy form
      movieTitle: movie?.title,
      cinema: cinema?.name,
      screen: screen?.name,
      showtime,
      date: new Date(date).toLocaleDateString(),
      seats: selectedSeats.join(', '),
      totalPrice: totalPrice.toFixed(2),
    });
    setIsPaymentModalOpen(false);
    alert(`Tickets booked for ${movie.title}! (Mock confirmation)\nSeats: ${selectedSeats.join(', ')}\nTotal: ₹${totalPrice.toFixed(2)}\nConfirmation sent to ${formData.email}.`);
    navigate('/movies'); // Navigate to movies page or a booking success page
  };


  if (!movie || !cinema || !screen || !showtime || !date) {
    return (
      <div className="container page-error" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Oops!</h2>
        <p>Booking details are missing or incomplete. Please go back and select a movie and showtime again.</p>
        <button onClick={() => navigate('/movies')} className="btn">Go to Movies</button>
      </div>
    );
  }

  const paymentModalDetails = {
    "Movie": movie.title,
    "Cinema": `${cinema.name} - ${screen.name}`,
    "Date & Time": `${new Date(date).toLocaleDateString()} - ${showtime}`,
    "Selected Seats": selectedSeats.join(', ') || "None",
    "Total Amount": `₹${totalPrice.toFixed(2)}`
  };

  return (
    <div className="container seat-selection-page">
      <h2>Select Your Seats</h2>
      <div className="booking-summary">
        <p><strong>Movie:</strong> {movie.title}</p>
        <p><strong>Cinema:</strong> {cinema.name} - {screen.name}</p>
        <p><strong>Date & Time:</strong> {new Date(date).toLocaleDateString()} - {showtime}</p>
      </div>

      <div className="screen-area">
        <div className="screen-ui">SCREEN THIS WAY</div>
      </div>

      <div className="seat-map">
        {seatLayout.length > 0 ? seatLayout.map((row) => (
          <div key={row.rowName} className="seat-row">
            <span className="row-label">{row.rowName}</span>
            <div className="seats">
              {row.seats.map((seat) => (
                <div
                  key={seat.id}
                  className={
                    `seat ${seat.isBooked ? 'booked' : ''} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`
                  }
                  onClick={() => handleSeatClick(seat)}
                  role="button"
                  tabIndex={seat.isBooked ? -1 : 0}
                  onKeyPress={(e) => e.key === 'Enter' && !seat.isBooked && handleSeatClick(seat)}
                  aria-label={`Seat ${seat.number}${seat.isBooked ? ' (Booked)' : selectedSeats.includes(seat.id) ? ' (Selected)' : ' (Available)'}`}
                >
                  {seat.number}
                </div>
              ))}
            </div>
          </div>
        )) : <p>Loading seat layout...</p>}
      </div>

      <div className="seat-legend">
        <div className="legend-item"><div className="seat available-legend"></div> Available</div>
        <div className="legend-item"><div className="seat selected-legend"></div> Selected</div>
        <div className="legend-item"><div className="seat booked-legend"></div> Booked</div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="checkout-summary">
          <p>Selected Seats: <strong>{selectedSeats.join(', ')}</strong></p>
          <h3>Total Price: ₹{totalPrice.toFixed(2)}</h3>
          <button className="btn proceed-btn" onClick={handleProceedToPayment} disabled={totalPrice <= 0}>
            Proceed to Confirm ₹{totalPrice.toFixed(2)}
          </button>
        </div>
      )}

      <DummyPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handleDummyPaymentSubmit}
        title="Confirm Your Movie Tickets"
        details={paymentModalDetails}
        submitButtonText={`Confirm & Book (₹${totalPrice.toFixed(2)})`}
      />
    </div>
  );
};

export default SeatSelectionPage;