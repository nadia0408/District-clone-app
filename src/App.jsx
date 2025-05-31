// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MoviesPage from './pages/MoviesPage';
import DiningPage from './pages/DiningPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import ShowtimeSelectionPage from './pages/ShowtimeSelectionPage'; // Import
import SeatSelectionPage from './pages/SeatSelectionPage';     // Import

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/movies" />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
          <Route path="/movie/:movieId/book" element={<ShowtimeSelectionPage />} /> {/* Showtime selection */}
          <Route path="/movie/:movieId/select-seats" element={<SeatSelectionPage />} /> {/* Seat selection */}
          <Route path="/dining" element={<DiningPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;