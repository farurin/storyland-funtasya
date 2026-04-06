import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();

  // Jika tidak login, arahkan ke halaman login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Jika login, izinkan akses ke halaman tujuan
  return <Outlet />;
};

export default ProtectedRoute;
