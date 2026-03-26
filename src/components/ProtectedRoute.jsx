import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // If Supabase is still checking local storage for an active session, show nothing to prevent flicker
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If the user is missing a JWT session entirely, bounce them back to the login screen
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If they are safely authenticated, render the children routes!
  return <Outlet />;
};
