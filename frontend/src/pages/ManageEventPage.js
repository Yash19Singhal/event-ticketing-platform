import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ManageEventPage = () => {
  const { eventId } = useParams();

  const [attendees, setAttendees] = useState([]);
  const [eventName, setEventName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('Not authorized. Please log in.');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const attendeesRes = await axios.get(
          `/api/events/${eventId}/attendees`,
          config
        );
        setAttendees(attendeesRes.data);

        const eventRes = await axios.get(`/api/events/${eventId}`, config);
        setEventName(eventRes.data.title);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]);

  if (loading) return <div>Loading attendee list...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <Link to="/organizer/dashboard">&larr; Back to Dashboard</Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h1>Manage Event: {eventName}</h1>
        <Link
          to={`/organizer/event/${eventId}/edit`}
          style={{
            textDecoration: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '5px',
          }}
        >
          Edit Event Details
        </Link>
      </div>

      <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: '20px' }}>
        Attendee List
      </h2>

      {attendees.length === 0 ? (
        <p>No tickets have been sold for this event yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Attendee Name</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Ticket Type</th>
              <th style={{ padding: '12px' }}>Ticket ID</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee, index) => (
              <tr key={attendee.ticketId || index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{attendee.attendeeName}</td>
                <td style={{ padding: '12px' }}>{attendee.attendeeEmail}</td>
                <td style={{ padding: '12px' }}>{attendee.ticketTypeName}</td>
                <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '12px' }}>
                  {attendee.ticketId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageEventPage;
