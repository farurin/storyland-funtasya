import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Ambil token dan data user dari Local Storage jika ada
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null,
  );

  // Status login sekarang ditentukan oleh ADA ATAU TIDAKNYA token
  const isLoggedIn = !!token;

  // Fungsi login sekarang menerima token dan data user dari Backend
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
