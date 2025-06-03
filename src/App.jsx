// src/App.jsx
import React from 'react';
// Added Link and useLocation, removed unused RazorpayCheckout
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'; 
import Navbar from './components/Navbar';
import MoviesPage from './pages/MoviesPage';
import DiningPage from './pages/DiningPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import ShowtimeSelectionPage from './pages/ShowtimeSelectionPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
// Removed: import RazorpayCheckout from 'react-native-razorpay'; 

// Component for the 404 page, which also displays the path
const NotFoundPage = () => {
  const location = useLocation();
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
      <h1>Error 404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist or could not be found.</p>
      <p>
        Attempted URL: <strong>{location.pathname}{location.search}</strong>
      </p>
      <Link to="/" className="btn" style={{marginTop: '20px'}}>Go to Homepage</Link>
    </div>
  );
};

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Redirects root path to /movies. 'replace' is good practice for redirects. */}
          <Route path="/" element={<Navigate to="/movies" replace />} />

          {/* Your application's main routes */}
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movie/:movieId" element={<MovieDetailsPage />} />
          <Route path="/movie/:movieId/book" element={<ShowtimeSelectionPage />} />
          <Route path="/movie/:movieId/select-seats" element={<SeatSelectionPage />} />
          <Route path="/dining" element={<DiningPage />} />

          {/* Catch-all route for 404 Not Found pages */}
          {/* This will render if no other route matches the current URL. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;