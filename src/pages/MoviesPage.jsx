// src/pages/MoviesPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Import useSearchParams
import { fetchNowShowingMovies, searchMovies } from '../services/tmdbService';
import MovieCard from '../components/MovieCard';
import './MoviesPage.css';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams(); // Get search params from URL
  const [pageTitle, setPageTitle] = useState('Now Showing');

  useEffect(() => {
    const query = searchParams.get('search'); // Get 'search' query param

    const getMovies = async () => {
      setLoading(true);
      setError('');
      let fetchedMovies = [];

      if (query) {
        setPageTitle(`Search Results for "${query}"`);
        fetchedMovies = await searchMovies(query);
        if (fetchedMovies.length === 0) {
          setError(`No movies found for "${query}". Try a different search!`);
        }
      } else {
        setPageTitle('Now Showing');
        fetchedMovies = await fetchNowShowingMovies();
        if (fetchedMovies.length === 0) {
          setError('Could not load movies. Please try again later.');
        }
      }
      setMovies(fetchedMovies);
      setLoading(false);
    };

    getMovies();
  }, [searchParams]); // Re-run effect when searchParams change

  if (loading) {
    return <div className="container page-loading">Loading movies...</div>;
  }

  return (
    <div className="container movies-page">
      <h2 className="page-title">{pageTitle}</h2>
      {error && !movies.length ? ( // Show error only if no movies AND error exists
        <p className="page-error">{error}</p>
      ) : movies.length > 0 ? (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        // This case might occur if API returns empty array without error
        // or if error is set but movies somehow loaded (less likely)
        <p>No movies to display at the moment.</p>
      )}
    </div>
  );
};

export default MoviesPage;