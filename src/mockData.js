// src/mockData.js

export const mockCinemas = [
  {
    id: 'cinema1',
    name: 'PVR Ambience Gold',
    location: 'Gurugram',
    screens: [
      {
        id: 'screenA',
        name: 'Audi 1 (Gold Class)',
        showtimes: ['10:00 AM', '01:15 PM', '04:30 PM', '07:45 PM', '11:00 PM'],
      },
      {
        id: 'screenB',
        name: 'Audi 2 (4DX)',
        showtimes: ['11:00 AM', '02:30 PM', '06:00 PM', '09:30 PM'],
      },
    ],
  },
  {
    id: 'cinema2',
    name: 'INOX Insignia',
    location: 'Delhi',
    screens: [
      {
        id: 'screenC',
        name: 'Screen 1 (Insignia)',
        showtimes: ['09:30 AM', '12:45 PM', '04:00 PM', '07:15 PM', '10:30 PM'],
      },
    ],
  },
  {
    id: 'cinema3',
    name: 'Cinepolis Fun City',
    location: 'Gurugram',
    screens: [
      {
        id: 'screenD',
        name: 'Audi 5',
        showtimes: ['10:15 AM', '01:00 PM', '03:45 PM', '06:30 PM', '09:15 PM'],
      },
    ],
  },
];

// seatPrice is per seat
export const getMockSeatLayout = (screenId) => {
  // For simplicity, all screens have a similar layout.
  // In reality, this would be very different per screen.
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const layout = [];
  const seatPrice = screenId.includes('Gold') || screenId.includes('Insignia') || screenId.includes('4DX') ? 550 : 250;

  for (const row of rows) {
    const rowSeats = [];
    for (let i = 1; i <= seatsPerRow; i++) {
      // Randomly mark some seats as booked (for demo)
      const isBooked = Math.random() < 0.2;
      rowSeats.push({ id: `${row}${i}`, number: i, row: row, isBooked, price: seatPrice });
    }
    layout.push({ rowName: row, seats: rowSeats });
  }
  return layout;
};

// src/mockData.js
// ... (keep existing mockCinemas and getMockSeatLayout if you still need them for movies)

export const mockRestaurants = [
  {
    id: 'resto1',
    name: 'The Culinary Haven',
    cuisine: ['Italian', 'Continental'],
    rating: 4.5,
    price_range: '$$$', // (e.g., $, $$, $$$)
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    location_short: 'Downtown Plaza',
    description_short: 'Authentic Italian pasta and wood-fired pizzas.',
    // For booking (simplified mock availability)
    availability: {
        slots: ['12:00 PM', '01:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'],
        max_guests: 8,
    }
  },
  {
    id: 'resto2',
    name: 'Spice Symphony',
    cuisine: ['Indian', 'Mughlai'],
    rating: 4.8,
    price_range: '$$',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    location_short: 'City Center',
    description_short: 'Rich Indian curries and tandoori delights.',
    availability: {
        slots: ['12:30 PM', '01:30 PM', '07:00 PM', '08:30 PM', '09:30 PM'],
        max_guests: 6,
    }
  },
  {
    id: 'resto3',
    name: 'Sushi Central',
    cuisine: ['Japanese', 'Sushi'],
    rating: 4.2,
    price_range: '$$$$',
    image_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    location_short: 'Ocean View Mall',
    description_short: 'Fresh sushi and sashimi crafted by master chefs.',
    availability: {
        slots: ['01:00 PM', '02:00 PM', '06:30 PM', '07:30 PM', '08:30 PM'],
        max_guests: 4,
    }
  },
  {
    id: 'resto4',
    name: 'Green Leaf Cafe',
    cuisine: ['Vegetarian', 'Healthy', 'Cafe'],
    rating: 4.6,
    price_range: '$',
    image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
    location_short: 'Parkside Avenue',
    description_short: 'Delicious vegetarian options and fresh juices.',
    availability: {
        slots: ['11:00 AM', '12:00 PM', '01:00 PM', '05:00 PM', '06:00 PM'],
        max_guests: 6,
    }
  },
  // Add more restaurants as needed
];

// Helper function to get unique cuisines for filters
export const getUniqueCuisines = () => {
    const allCuisines = mockRestaurants.flatMap(r => r.cuisine);
    return [...new Set(allCuisines)].sort();
};