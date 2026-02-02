import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SalesChart from '../components/SalesChart'; 

const EventAnalyticsPage = () => {
  const { eventId } = useParams();
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }};
      const { data } = await axios.get(`/api/orders/stats/by-type/${eventId}`, config);
      setSalesData(data);
      setLoading(false);
    };
    fetchSalesData();
  }, [eventId]);

  if (loading) return <div>Loading chart data...</div>;

  return (
    <div>
      <h1>Event Analytics</h1>
      {salesData && salesData.length > 0 ? (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <SalesChart chartData={salesData} />
        </div>
      ) : (
        <p>No sales data available for this event yet.</p>
      )}
    </div>
  );
};