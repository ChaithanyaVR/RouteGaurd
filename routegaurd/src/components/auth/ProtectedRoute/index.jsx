import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import Loader from "../../Loader";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
