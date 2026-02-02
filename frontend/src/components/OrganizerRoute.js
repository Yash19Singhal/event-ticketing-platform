import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrganizerRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && user.role === 'organizer') {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default OrganizerRoute;
