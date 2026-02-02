// frontend/src/pages/EditEventPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventForm from '../components/EventForm';

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(`/api/events/${eventId}`);
        setInitialData(data);
      } catch (err) {
        setError('Failed to fetch event data.');
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleUpdateEvent = async (eventData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('userToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`/api/events/${eventId}`, eventData, config);
      
      navigate('/organizer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event.');
      setIsLoading(false);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!initialData) return <div>Loading event details...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Edit Event</h1>
      <EventForm
        onSubmit={handleUpdateEvent}
        initialData={initialData}
        isLoading={isLoading}
        buttonText="Save Changes"
      />
    </div>
  );
};

export default EditEventPage;