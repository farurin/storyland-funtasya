import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Corner from "./pages/Corner";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      {/* auth routes (tanpa navbar/footer) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* main layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/corner" element={<Corner />} />
      </Route>
    </Routes>
  );
}
