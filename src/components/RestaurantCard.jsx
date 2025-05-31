// src/components/RestaurantCard.jsx
import React from 'react';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant, onBookTable }) => {
  return (
    <div className="restaurant-card">
      <div className="restaurant-image-container">
        <img src={restaurant.image_url} alt={restaurant.name} className="restaurant-image" />
        <div className="restaurant-rating">⭐ {restaurant.rating.toFixed(1)}</div>
      </div>
      <div className="restaurant-details">
        <h3>{restaurant.name}</h3>
        <p className="restaurant-cuisine">{restaurant.cuisine.join(', ')}</p>
        <p className="restaurant-location">{restaurant.location_short} • {restaurant.price_range}</p>
        <p className="restaurant-description">{restaurant.description_short}</p>
        <button className="btn btn-book-table" onClick={() => onBookTable(restaurant)}>
          Book a Table
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;