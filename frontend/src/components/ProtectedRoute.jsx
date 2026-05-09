import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/authContext';
import React from 'react';
import PropTypes from "prop-types";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};