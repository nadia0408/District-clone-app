// src/pages/DiningPage.jsx
import React, { useState, useEffect } from 'react';
import { mockRestaurants, getUniqueCuisines } from '../mockData'; // Import restaurant data
import RestaurantCard from '../components/RestaurantCard';
import BookingModal from '../components/BookingModal';
import './DiningPage.css';

// Icons from original screenshot (can be replaced with actual SVGs/icon library)
const DownloadIcon = () => <span className="hero-icon">📱</span>;
const TableIcon = () => <span className="hero-icon">🍽️</span>;
const BillIcon = () => <span className="hero-icon">🧾</span>;

const DiningPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [allCuisines, setAllCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRestaurantForBooking, setSelectedRestaurantForBooking] = useState(null);

  useEffect(() => {
    // In a real app, you'd fetch this data
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

  const handleBookingSubmit = (bookingDetails) => {
    console.log("Booking Submitted:", bookingDetails);
    // Here you would typically send this to a backend
    alert(`Booking confirmed for ${bookingDetails.guests} guest(s) at ${bookingDetails.restaurantName} on ${bookingDetails.date} at ${bookingDetails.time}! (This is a mock confirmation)`);
  };


  return (
    <div className="container dining-page">
      {/* Hero Section - Re-styled a bit */}
      <section className="dining-hero-v2">
        <div className="hero-card-v2">
          <DownloadIcon />
          <h3>Download MyDistrict app</h3>
          <p>Get exclusive deals & features.</p>
        </div>
        <div className="hero-card-v2">
          <TableIcon />
          <h3>Book a table</h3>
          <p>Reserve your spot easily.</p>
        </div>
        <div className="hero-card-v2">
          <BillIcon />
          <h3>Pay bill on MyDistrict</h3>
          <p>Quick and secure payments.</p>
        </div>
      </section>

      {/* Filters Section */}
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

      {/* Restaurant Listing Section */}
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

      {/* Original "District Specials" section - can be kept or removed */}
      <section className="district-specials">
        <h2>Enjoy iconic MyDistrict specials</h2>
        {/* ... (rest of the specials content from your previous DiningPage.jsx) ... */}
        <div className="specials-grid">
          <div className="special-item"><h3>Signature packages</h3><p>Curated menus & selections...</p></div>
          <div className="special-item"><h3>Peak hour booking</h3><p>Skip the queue...</p></div>
          <div className="special-item"><h3>On-the-house</h3><p>Complimentary delights...</p></div>
        </div>
      </section>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        restaurant={selectedRestaurantForBooking}
        onSubmitBooking={handleBookingSubmit}
      />
    </div>
  );
};

export default DiningPage;