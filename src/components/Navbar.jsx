// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search bar after navigation
    }
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          MyDistrict
        </Link>
        {/* Removed nav-location */}
        <ul className="nav-menu">
          <li><NavLink to="/dining" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dining</NavLink></li>
          <li><NavLink to="/movies" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Movies</NavLink></li>
        </ul>
        <div className="nav-search-user">
          <form onSubmit={handleSearchSubmit} className="nav-search-form">
            <input
              type="text"
              placeholder="Search for movies..." // Updated placeholder
              className="nav-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* You could add a search button icon here if desired */}
          </form>
          <div className="nav-user-icon">👤</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;