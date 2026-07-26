import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f8fafc"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    if (user?.role === 'ADMIN') {
      if (location.pathname === '/formations') {
        return <Navigate to="/admin/formations" replace />;
      }
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user?.role === 'PARTICIPANT') {
      return <Navigate to="/formations" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
// Import react is required for older react or standard configs
