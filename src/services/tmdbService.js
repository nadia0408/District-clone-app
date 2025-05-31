// src/services/tmdbService.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchNowShowingMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: 1,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching now showing movies:', error);
    return [];
  }
};

// NEW: Fetch details for a single movie
export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        append_to_response: 'release_dates', // To get certifications if needed
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie ${movieId}:`, error);
    return null;
  }
};

// NEW: Search for movies
export const searchMovies = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        query: query,
        page: 1,
        include_adult: false, // Optional: filter adult content
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Error searching movies for query "${query}":`, error);
    return [];
  }
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) {
    return 'https://via.placeholder.com/500x750.png?text=No+Image';
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
};