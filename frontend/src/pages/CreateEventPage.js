// frontend/src/pages/CreateEventPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventForm from '../components/EventForm'; 

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateEvent = async (eventData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { imageFile, ...eventDetails } = eventData;
      let finalEventData = { ...eventDetails };

      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);

        const uploadConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data: uploadData } = await axios.post('/api/upload', uploadFormData, uploadConfig);

        finalEventData.image = uploadData.imageUrl;
      }

      const createConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post('/api/events', finalEventData, createConfig);

      navigate('/organizer/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to create event. Please try again.'
      );
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Create a New Event</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <EventForm
        onSubmit={handleCreateEvent}
        isLoading={isLoading}
        buttonText="Create Event"
      />
    </div>
  );
};

export default CreateEventPage;
