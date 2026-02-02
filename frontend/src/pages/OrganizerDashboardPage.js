import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrganizerDashboardPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get('/api/events/my-events', config);
        setMyEvents(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  if (loading) return <div>Loading your events...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Organizer Dashboard</h1>

        {/* ✅ FIXED PATH */}
        <Link
          to="/organizer/event/create"
          style={{
            textDecoration: 'none',
            color: '#fff',
            backgroundColor: '#28a745',
            padding: '10px 15px',
            borderRadius: '5px',
            fontWeight: 'bold',
          }}
        >
          + Create New Event
        </Link>
      </div>

      <h2>My Events</h2>

      {myEvents.length === 0 ? (
        <p>You have not created any events yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {myEvents.map((event) => (
            <div
              key={event._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
              }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{event.title}</h3>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>

              <div>
                <Link to={`/organizer/event/${event._id}/manage`} style={{ marginRight: '10px' }}>
                  Manage Attendees
                </Link>
                <Link to={`/event/${event._id}`} target="_blank" rel="noopener noreferrer">
                  View Public Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboardPage;
