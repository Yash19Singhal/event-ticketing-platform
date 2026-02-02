import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to view your tickets.');
        }

        const { data } = await axios.get('/api/orders/my-tickets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTickets(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to fetch tickets'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, []);

  if (loading) {
    return <div>Loading your tickets...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  const getTicketTypeName = (ticket) => {
    const type = ticket.event.ticketTypes.find(
      t => t._id === ticket.ticketType
    );
    return type ? type.name : 'N/A';
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>My Tickets</h1>

      {tickets.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: '50px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
          }}
        >
          <h2>You haven't purchased any tickets yet.</h2>
          <p>Why not find an event to attend?</p>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#fff',
              backgroundColor: '#007bff',
              padding: '10px 20px',
              borderRadius: '5px',
              display: 'inline-block',
              marginTop: '10px',
            }}
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {tickets.map(ticket => (
            <div
              key={ticket._id}
              style={{
                display: 'flex',
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ padding: '20px', flex: 1 }}>
                <h2>{ticket.event.title}</h2>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(ticket.event.date).toLocaleString()}
                </p>
                <p>
                  <strong>Location:</strong> {ticket.event.location}
                </p>
                <p>
                  <strong>Ticket Type:</strong> {getTicketTypeName(ticket)}
                </p>
                <p>
                  <strong>Ticket ID:</strong> {ticket.uniqueCode}
                </p>
              </div>

              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#f7f7f7',
                  borderLeft: '1px dashed #ccc',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={ticket.qrCode}
                  alt="Ticket QR Code"
                  style={{ width: '150px', height: '150px' }}
                />
                <p
                  style={{
                    marginTop: '10px',
                    fontSize: '12px',
                    color: '#555',
                  }}
                >
                  Scan at event entry
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
