// src/pages/SeatSelectionPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMockSeatLayout } from '../mockData'; // Assuming this provides seat layout
import './SeatSelectionPage.css';

const SeatSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie, cinema, screen, showtime, date } = location.state || {};

  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]); // Array of seat IDs like "A1", "B5"
  const [totalPrice, setTotalPrice] = useState(0);

  // Effect to load seat layout based on screen
  useEffect(() => {
    if (screen && screen.id) {
      // In a real app, you might fetch this from an API
      setSeatLayout(getMockSeatLayout(screen.id));
    } else {
      // Handle case where screen info is missing if necessary
      setSeatLayout([]);
    }
  }, [screen]);

  // Effect to calculate total price when selected seats or layout changes
  useEffect(() => {
    let currentTotal = 0;
    if (seatLayout.length > 0) {
      selectedSeats.forEach(seatId => {
        // Find the seat in the layout to get its price
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

  // Helper function to load the Razorpay SDK script
  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSeatClick = (seat) => {
    if (!seat || seat.isBooked) return; // Can't select booked or invalid seats

    setSelectedSeats(prevSelectedSeats => {
      if (prevSelectedSeats.includes(seat.id)) {
        return prevSelectedSeats.filter(sId => sId !== seat.id); // Deselect
      } else {
        if (prevSelectedSeats.length < 10) { // Max 10 seats limit
          return [...prevSelectedSeats, seat.id]; // Select
        }
        alert("You can select a maximum of 10 seats.");
        return prevSelectedSeats; // Limit reached, return current selection
      }
    });
  };

  const handleProceedToPayment = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log("Using VITE_RAZORPAY_KEY_ID:", razorpayKeyId);

    if (!razorpayKeyId) {
      alert("Razorpay Key ID is missing. Please configure it in your environment variables.");
      console.error("VITE_RAZORPAY_KEY_ID is not set.");
      return;
    }

    // Load Razorpay script
    const sdkLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!sdkLoaded) {
      alert('Razorpay SDK failed to load. Please check your internet connection and try again.');
      return;
    }

    const amountInPaise = Math.round(totalPrice * 100); // Razorpay expects amount in smallest currency unit (paise for INR)
    console.log("Total Price (Rupees):", totalPrice, "Amount for Razorpay (Paise):", amountInPaise);

    if (amountInPaise < 100) { // Razorpay minimum is ₹1.00 (100 paise)
      alert("Minimum transaction amount is ₹1.00. Your total is too low.");
      return;
    }

    // Prepare booking details for notes, ensuring values are strings or simple types
    const bookingDetailsForNotes = {
      movieTitle: String(movie?.title || 'N/A'),
      cinemaName: String(cinema?.name || 'N/A'),
      screenName: String(screen?.name || 'N/A'),
      showtime: String(showtime || 'N/A'),
      bookingDate: date ? new Date(date).toLocaleDateString() : 'N/A',
      selectedSeats: selectedSeats.join(', '), // Convert array to comma-separated string
      totalPriceInRupees: String(totalPrice.toFixed(2)),
      booking_source: "MyDistrict Web App"
    };
    console.log("Proceeding to payment with booking details (for notes):", bookingDetailsForNotes);


    const options = {
      key: razorpayKeyId, // Your Razorpay Test Key ID
      amount: amountInPaise,
      currency: "INR",
      name: "MyDistrict App Booking", // Name of your business
      description: `Tickets: ${movie?.title || 'Movie'} - ${selectedSeats.length} seat(s)`,
      image: "https://via.placeholder.com/150?text=MyDistrict", // URL of your company logo

      // IMPORTANT: For a frontend-only integration (no backend to create Razorpay Order ID first),
      // you should NOT pass an 'order_id' here. Razorpay's checkout.js will handle it.
      // If you have a backend that creates an order_id via Razorpay's Orders API,
      // then you would pass that 'order_id' here.
      // order_id: "order_XXXXXXXXXXXXXX", // <<--- DO NOT UNCOMMENT unless you have a backend-generated Order ID

      handler: async function (response) {
        console.log("Razorpay payment successful:", response);
        // In a real application, you MUST send 'response.razorpay_payment_id',
        // 'response.razorpay_order_id', and 'response.razorpay_signature'
        // to your backend server for verification.
        // This verification step is crucial for security.
        alert(`Payment Successful (Mock Verification)!\nPayment ID: ${response.razorpay_payment_id}\nOrder ID (from Razorpay): ${response.razorpay_order_id}`);
        
        // After successful (mock) payment, navigate away or update UI
        navigate('/movies'); // Example: Navigate to movies page
      },
      prefill: {
        // You can prefill customer details if available
        // name: "Customer Name",
        // email: "customer@example.com",
        // contact: "9999999999"
      },
      notes: bookingDetailsForNotes, // Custom notes object
      theme: {
        color: "#00f5d4" // A color that matches your app's theme
      },
      modal: {
        ondismiss: function () {
          console.log('Razorpay modal dismissed by user.');
          // Optionally, inform the user or log this event
          // alert('Payment cancelled or Razorpay modal closed.');
        }
      }
    };

    try {
      const paymentObject = new window.Razorpay(options);

      paymentObject.on('payment.failed', function (response) {
        // This event is triggered when a payment fails.
        console.error('Razorpay Payment Failed. Error:', response.error);
        console.error('Error Code:', response.error.code);
        console.error('Error Description:', response.error.description);
        console.error('Error Source:', response.error.source);
        console.error('Error Step:', response.error.step);
        console.error('Error Reason:', response.error.reason);
        if (response.error.metadata) {
          console.error('Error Metadata (Order ID, Payment ID):', response.error.metadata);
        }
        alert(`Payment Failed: ${response.error.description || 'Unknown error'}\n(Code: ${response.error.code || 'N/A'})`);
      });

      paymentObject.open(); // This opens the Razorpay checkout modal

    } catch (error) {
      console.error("Error initializing Razorpay checkout:", error);
      alert("Could not initialize payment process. Please check console for errors and try again.");
    }
  };

  // Render a fallback if essential booking details are missing
  if (!movie || !cinema || !screen || !showtime || !date) {
    return (
      <div className="container page-error" style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Oops!</h2>
        <p>Booking details are missing or incomplete. Please go back and select a movie and showtime again.</p>
        <button onClick={() => navigate('/movies')} className="btn">Go to Movies</button>
      </div>
    );
  }

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
                  role="button" // for accessibility
                  tabIndex={seat.isBooked ? -1 : 0} // for accessibility
                  onKeyPress={(e) => e.key === 'Enter' && !seat.isBooked && handleSeatClick(seat)} // for accessibility
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
            Proceed to Pay ₹{totalPrice.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;