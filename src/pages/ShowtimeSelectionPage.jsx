// src/pages/ShowtimeSelectionPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchMovieDetails } from '../services/tmdbService';
import { mockCinemas } from '../mockData'; // Import mock data
import './ShowtimeSelectionPage.css';

const ShowtimeSelectionPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // To get movie details if passed via state

  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loadingMovie, setLoadingMovie] = useState(!location.state?.movie);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Today's date

  useEffect(() => {
    if (!movie) {
      const getDetails = async () => {
        setLoadingMovie(true);
        const details = await fetchMovieDetails(movieId);
        setMovie(details);
        setLoadingMovie(false);
      };
      getDetails();
    }
  }, [movieId, movie]);

  // For demo, showtimes are the same regardless of date
  // In a real app, showtimes would vary by date

  const handleShowtimeSelect = (cinema, screen, showtime) => {
    navigate(`/movie/${movieId}/select-seats`, {
      state: {
        movie,
        cinema,
        screen,
        showtime,
        date: selectedDate,
      },
    });
  };

  if (loadingMovie) {
    return <div className="container page-loading">Loading movie details...</div>;
  }

  if (!movie) {
    return <div className="container page-error">Movie details not found.</div>;
  }

  return (
    <div className="container showtime-selection-page">
      <h2>Book Tickets for: {movie.title}</h2>
      <div className="date-selector">
        <label htmlFor="show-date">Select Date: </label>
        <input
          type="date"
          id="show-date"
          value={selectedDate}
          min={new Date().toISOString().split('T')[0]} // Prevent past dates
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {mockCinemas.map((cinema) => (
        <div key={cinema.id} className="cinema-card">
          <h3>{cinema.name}</h3>
          <p className="cinema-location">{cinema.location}</p>
          {cinema.screens.map((screen) => (
            <div key={screen.id} className="screen-info">
              <h4>{screen.name}</h4>
              <div className="showtimes-grid">
                {screen.showtimes.map((time) => (
                  <button
                    key={time}
                    className="showtime-btn"
                    onClick={() => handleShowtimeSelect(cinema, screen, time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ShowtimeSelectionPage;