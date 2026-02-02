// frontend/src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        
        const url = query
          ? `/api/events?keyword=${encodeURIComponent(query)}`
          : '/api/events';

        const { data } = await axios.get(url);
        setEvents(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [query]); 

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery(searchInput.trim());
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Upcoming Events</h1>

      <SearchBar
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onSubmit={handleSearchSubmit}
      />

      {loading && <div>Loading events...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {!loading && events.length === 0 ? (
        <p style={{ textAlign: 'center' }}>
          {query ? `No events found for "${query}"` : 'No events found.'}
        </p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
          }}
        >
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
