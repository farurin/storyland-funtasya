import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = ({ allowedRoles }) => {
  const { isLoggedIn, user } = useAuth();

  // 1. Jika belum login, kembalikan ke halaman beranda
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // 2. Jika sudah login tapi role-nya tidak diizinkan, kembalikan ke halaman beranda
  if (user && !allowedRoles.includes(user.role)) {
    // Opsional: Kamu bisa buat halaman khusus "Akses Ditolak" atau alert
    return <Navigate to="/" replace />;
  }

  // 3. Jika aman, persilakan masuk
  return <Outlet />;
};

export default AdminRoute;
