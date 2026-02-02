import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';

const EventDetailPage = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketQuantities, setTicketQuantities] = useState({});

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setError(null);
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);

        const initialQuantities = response.data.ticketTypes.reduce((acc, ticket) => {
          acc[ticket._id] = 0;
          return acc;
        }, {});
        setTicketQuantities(initialQuantities);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleQuantityChange = (ticketTypeId, newQuantity) => {
    const quantity = Math.max(0, Number(newQuantity));
    setTicketQuantities(prev => ({
      ...prev,
      [ticketTypeId]: quantity,
    }));
  };

  const calculateTotal = () => {
    if (!event) return 0;
    return event.ticketTypes.reduce((total, ticket) => {
      const quantity = ticketQuantities[ticket._id] || 0;
      return total + ticket.price * quantity;
    }, 0);
  };

  const totalAmount = calculateTotal();

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {!event ? (
        <h1>Event Not Found</h1>
      ) : (
        <>
          <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '30px' }}>
            Tickets
          </h2>

          {event.ticketTypes.map(ticket => (
            <div
              key={ticket._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                border: '1px solid #ddd',
                marginBottom: '10px',
                borderRadius: '4px',
              }}
            >
              <div>
                <strong>{ticket.name}</strong>
                <p>Price: ₹{ticket.price}</p>
                <p style={{ color: '#666' }}>{ticket.quantity} available</p>
              </div>

              <input
                type="number"
                min="0"
                max={ticket.quantity}
                value={ticketQuantities[ticket._id] || 0}
                onChange={e => handleQuantityChange(ticket._id, e.target.value)}
                style={{ width: '60px', padding: '5px', textAlign: 'center' }}
              />
            </div>
          ))}

          {totalAmount > 0 && (
            <div
              style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#f4f4f4',
                borderRadius: '4px',
              }}
            >
              <h3>Total: ₹{totalAmount}</h3>

              <CheckoutForm
                eventId={id}
                tickets={Object.entries(ticketQuantities)
                  .map(([ticketTypeId, quantity]) => ({
                    ticketTypeId,
                    quantity,
                  }))
                  .filter(item => item.quantity > 0)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventDetailPage;
