import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Optional: show a loader while checking auth state
    return <div className="text-xl font-semibold pt-14">Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
