// src/pages/MovieDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate
import { fetchMovieDetails, getImageUrl } from '../services/tmdbService';
import './MovieDetailsPage.css';

const MovieDetailsPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getDetails = async () => {
      setLoading(true);
      setError('');
      const details = await fetchMovieDetails(movieId);
      if (details) {
        setMovie(details);
      } else {
        setError('Failed to fetch movie details. Please try again later.');
      }
      setLoading(false);
    };
    getDetails();
  }, [movieId]);

  // --- Function to handle "Book Tickets" click ---
  const handleBookTicketsClick = () => {
    if (movie) {
      navigate(`/movie/${movieId}/book`, { state: { movie } }); // Pass movie object to next page
    }
  };
  // --- End of Book Tickets handler ---

  if (loading) {
    return <div className="container page-loading">Loading movie details...</div>;
  }

  if (error) {
    return <div className="container page-error">{error}</div>;
  }

  if (!movie) {
    return <div className="container">Movie not found.</div>;
  }

  const certification = movie.adult ? 'A' : (movie.release_dates?.results?.find(r => r.iso_3166_1 === 'US')?.release_dates[0]?.certification || 'UA');

  // --- Get Trailer ---
  const officialTrailer = movie.videos?.results?.find(
    video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser') && video.official
  ) || movie.videos?.results?.find(
    video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
  );
  // --- End Get Trailer ---

  // --- Get Cast (e.g., top 10 ordered by 'order' or popularity) ---
  const topCast = movie.credits?.cast?.slice(0, 10);
  // --- End Get Cast ---

  const backdropStyle = movie.backdrop_path
    ? { backgroundImage: `linear-gradient(to bottom, rgba(26, 29, 36, 0.7) 0%, rgba(26, 29, 36, 1) 100%), url(${getImageUrl(movie.backdrop_path, 'original')})` }
    : {};


  return (
    <div className="movie-details-page-wrapper"> {/* Wrapper for backdrop */}
      <div className="movie-details-header-backdrop" style={backdropStyle}>
        <div className="container movie-details-page"> {/* Original container for content alignment */}
          <div className="details-header">
            <img
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="details-poster"
            />
            <div className="details-info">
              <h1>{movie.title}</h1>
              <p className="tagline"><em>{movie.tagline}</em></p>
              <div className="quick-info">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>•</span>
                <span>{certification}</span>
                <span>•</span>
                <span>{movie.runtime} min</span>
              </div>
              <div className="genres">
                {movie.genres?.map(genre => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>
              <h3>Overview</h3>
              <p className="overview">{movie.overview}</p>
              <div className="ratings">
                <p>Rating: <strong>{movie.vote_average?.toFixed(1)}/10</strong> ({movie.vote_count} votes)</p>
              </div>
              <button className="btn book-tickets-btn" onClick={handleBookTicketsClick}>
                Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Trailer Section --- */}
      {officialTrailer && (
        <div className="container movie-section trailer-section">
          <h2>Trailer</h2>
          <div className="video-responsive">
            <iframe
              src={`https://www.youtube.com/embed/${officialTrailer.key}`}
              title={officialTrailer.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      {/* --- End Trailer Section --- */}


      {/* --- Cast Section --- */}
      {topCast && topCast.length > 0 && (
        <div className="container movie-section cast-section">
          <h2>Top Cast</h2>
          <div className="cast-grid">
            {topCast.map(actor => (
              <div key={actor.cast_id || actor.id} className="cast-member">
                <img
                  src={actor.profile_path ? getImageUrl(actor.profile_path, 'w185') : 'https://via.placeholder.com/185x278.png?text=No+Image'}
                  alt={actor.name}
                  className="cast-photo"
                />
                <p className="cast-name">{actor.name}</p>
                <p className="cast-character">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* --- End Cast Section --- */}
    </div>
  );
};

export default MovieDetailsPage;