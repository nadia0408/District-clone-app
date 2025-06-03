// src/pages/DiningPage.jsx
import React, { useState, useEffect } from 'react';
import { mockRestaurants, getUniqueCuisines } from '../mockData';
import RestaurantCard from '../components/RestaurantCard';
import BookingModal from '../components/BookingModal'; // This is the original restaurant booking modal
import DummyPaymentModal from '../components/DummyPaymentModal'; // Import the new dummy payment modal
import './DiningPage.css';

const DownloadIcon = () => <span className="hero-icon">📱</span>;
const TableIcon = () => <span className="hero-icon">🍽️</span>;
const BillIcon = () => <span className="hero-icon">🧾</span>;

const DiningPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [allCuisines, setAllCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false); // For original BookingModal
  const [selectedRestaurantForBooking, setSelectedRestaurantForBooking] = useState(null);

  // State for the dummy payment/confirmation modal
  const [isDummyPaymentModalOpen, setIsDummyPaymentModalOpen] = useState(false);
  const [currentBookingDetails, setCurrentBookingDetails] = useState(null);


  useEffect(() => {
    setRestaurants(mockRestaurants);
    setFilteredRestaurants(mockRestaurants);
    setAllCuisines(getUniqueCuisines());
  }, []);

  useEffect(() => {
    let result = restaurants;
    if (selectedCuisine) {
      result = result.filter(r => r.cuisine.includes(selectedCuisine));
    }
    if (searchTerm) {
      result = result.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cuisine.join(' ').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredRestaurants(result);
  }, [selectedCuisine, searchTerm, restaurants]);

  const handleOpenBookingModal = (restaurant) => {
    setSelectedRestaurantForBooking(restaurant);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedRestaurantForBooking(null);
  };

  // This is called when the original BookingModal (for date/time/guests) is submitted
  const handleBookingSubmit = (bookingDetails) => {
    console.log("Initial Booking Details:", bookingDetails);
    setCurrentBookingDetails(bookingDetails); // Store details
    setIsDummyPaymentModalOpen(true); // Open dummy confirmation/payment modal
  };

  const handleDummyRestaurantBookingConfirm = (formData) => {
    // formData contains name and email from the dummy form
    // currentBookingDetails contains restaurantId, restaurantName, date, time, guests
    console.log("Dummy Restaurant Booking Confirmed:", {
        ...formData, // name, email
        ...currentBookingDetails // restaurant details
    });
    setIsDummyPaymentModalOpen(false);
    alert(`Booking confirmed for ${currentBookingDetails.guests} guest(s) at ${currentBookingDetails.restaurantName} on ${currentBookingDetails.date} at ${currentBookingDetails.time}!\n(Mock confirmation) Details sent to ${formData.email}.`);
    setCurrentBookingDetails(null); // Clear current booking details
  };

  const dummyPaymentModalDetails = currentBookingDetails ? {
    "Restaurant": currentBookingDetails.restaurantName,
    "Date": currentBookingDetails.date,
    "Time": currentBookingDetails.time,
    "Guests": currentBookingDetails.guests
  } : {};


  return (
    <div className="container dining-page">
      <section className="dining-hero-v2">
        <div className="hero-card-v2"><DownloadIcon /><h3>Download MyDistrict app</h3><p>Get exclusive deals & features.</p></div>
        <div className="hero-card-v2"><TableIcon /><h3>Book a table</h3><p>Reserve your spot easily.</p></div>
        <div className="hero-card-v2"><BillIcon /><h3>Pay bill on MyDistrict</h3><p>Quick and secure payments.</p></div>
      </section>

      <section className="filters-section">
        <input
          type="text"
          placeholder="Search restaurants or cuisines..."
          className="search-input-dining"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="cuisine-filter-select"
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
        >
          <option value="">All Cuisines</option>
          {allCuisines.map(cuisine => (
            <option key={cuisine} value={cuisine}>{cuisine}</option>
          ))}
        </select>
      </section>

      <section className="restaurant-listing">
        <h2>Featured Restaurants</h2>
        {filteredRestaurants.length > 0 ? (
          <div className="restaurants-grid">
            {filteredRestaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onBookTable={handleOpenBookingModal}
              />
            ))}
          </div>
        ) : (
          <p className="no-restaurants-found">
            No restaurants match your criteria. Try adjusting your search or filters.
          </p>
        )}
      </section>

      <section className="district-specials">
        <h2>Enjoy iconic MyDistrict specials</h2>
        <div className="specials-grid">
          <div className="special-item"><h3>Signature packages</h3><p>Curated menus & selections...</p></div>
          <div className="special-item"><h3>Peak hour booking</h3><p>Skip the queue...</p></div>
          <div className="special-item"><h3>On-the-house</h3><p>Complimentary delights...</p></div>
        </div>
      </section>

      {/* This is the original modal for selecting date/time/guests for a restaurant */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        restaurant={selectedRestaurantForBooking}
        onSubmitBooking={handleBookingSubmit}
      />

      {/* This is the new dummy modal for "confirming/paying" the restaurant booking */}
      {currentBookingDetails && (
         <DummyPaymentModal
            isOpen={isDummyPaymentModalOpen}
            onClose={() => {
                setIsDummyPaymentModalOpen(false);
                setCurrentBookingDetails(null);
            }}
            onSubmit={handleDummyRestaurantBookingConfirm}
            title={`Confirm Booking at ${currentBookingDetails.restaurantName}`}
            details={dummyPaymentModalDetails}
            submitButtonText="Confirm Reservation"
        />
      )}
    </div>
  );
};

export default DiningPage;