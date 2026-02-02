import React from 'react';

import { Link } from 'react-router-dom';


const EventCard = ({ event }) => {

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const cardStyles = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    margin: '16px',
    maxWidth: '300px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textDecoration: 'none', 
    color: 'inherit', 
    display: 'block', 
  };

  const imageStyles = {
    width: '100%',
    height: '150px',
    objectFit: 'cover', 
    borderRadius: '4px',
  };

  return (
    
    <Link to={`/event/${event._id}`} style={cardStyles}>
      <img src={event.image} alt={event.title} style={imageStyles} />
      <h3>{event.title}</h3>
      <p>{formattedDate}</p>
      
      <p>{event.description.substring(0, 100)}...</p>
    </Link>
  );
};

export default EventCard;