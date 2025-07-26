import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AppContent);
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
