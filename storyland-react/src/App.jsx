import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Corner from "./pages/Corner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import BookDetail from "./pages/BookDetail";
import BookPreviewModal from "./components/BookPreviewModal";
import Profile from "./pages/Profile";
import About from "./pages/About"; // 1. Tambahkan import halaman About

export default function App() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          {/* Kategori */}
          <Route path="/categories" element={<Categories />} />

          {/* Detail Kategori */}
          <Route path="/categories/:id" element={<CategoryDetail />} />

          {/* Detail Baca Buku */}
          <Route path="/book/:id" element={<BookDetail />} />

          {/* Corner */}
          <Route path="/corner" element={<Corner />} />

          {/* About Us */}
          <Route path="/about" element={<About />} />

          {/* Rute yang dijaga satpam */}
          <Route element={<ProtectedRoute />}>
            {/* Profile */}
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>

      <BookPreviewModal />
    </>
  );
}
