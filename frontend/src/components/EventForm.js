// frontend/src/components/EventForm.js

import React, { useState, useEffect } from 'react';

const EventForm = ({ onSubmit, initialData = null, isLoading = false, buttonText = "Submit" }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [ticketTypes, setTicketTypes] = useState([{ name: '', price: '', quantity: '' }]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setDate(new Date(initialData.date).toISOString().split('T')[0]);
      setLocation(initialData.location);
      setTicketTypes(initialData.ticketTypes);

      if (initialData.image) {
        setImagePreview(initialData.image);
      }
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTicketChange = (index, event) => {
    const newTicketTypes = ticketTypes.map((ticket, i) =>
      i === index ? { ...ticket, [event.target.name]: event.target.value } : ticket
    );
    setTicketTypes(newTicketTypes);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: '', quantity: '' }]);
  };

  const removeTicketType = (index) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, date, location, ticketTypes, imageFile });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label>Event Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={10}
        />
      </div>

      <div>
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <h3 style={{ marginTop: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        Event Banner
      </h3>
      <div>
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div style={{ marginTop: '15px' }}>
            <p>Image Preview:</p>
            <img
              src={imagePreview}
              alt="Event Banner Preview"
              style={{ maxWidth: '300px', height: 'auto', border: '1px solid #ddd' }}
            />
          </div>
        )}
      </div>

      <h3 style={{ marginTop: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        Ticket Types
      </h3>

      {ticketTypes.map((ticket, index) => (
        <div
          key={index}
          style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px', border: '1px solid #eee' }}
        >
          <input
            type="text"
            name="name"
            placeholder="Ticket Name (e.g., VIP)"
            value={ticket.name}
            onChange={(e) => handleTicketChange(index, e)}
            required
            minLength={2}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={ticket.price}
            onChange={(e) => handleTicketChange(index, e)}
            required
            min="0"
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={ticket.quantity}
            onChange={(e) => handleTicketChange(index, e)}
            required
            min="1"
          />
          <button type="button" onClick={() => removeTicketType(index)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={addTicketType}>
        + Add Ticket Type
      </button>

      <button
        type="submit"
        disabled={isLoading}
        style={{ marginTop: '20px', padding: '12px', fontSize: '18px' }}
      >
        {isLoading ? 'Saving...' : buttonText}
      </button>
    </form>
  );
};

export default EventForm;
