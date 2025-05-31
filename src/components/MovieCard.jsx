// src/components/MovieCard.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { getImageUrl } from '../services/tmdbService';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card-link"> {/* Link added here */}
      <div className="movie-card">
        <img
          src={getImageUrl(movie.poster_path, 'w342')}
          alt={movie.title}
          className="movie-poster"
        />
        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-details">
            {/* Simplification: TMDB API for certifications is complex per region */}
            {/* We'll use 'adult' flag as a proxy for 'A' vs 'UA' */}
            {movie.adult ? 'A' : 'UA'} | {movie.original_language?.toUpperCase()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;