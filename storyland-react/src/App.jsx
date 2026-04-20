import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// User Pages
import Home from "./pages/Home";
import Corner from "./pages/Corner";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import BookDetail from "./pages/BookDetail";
import Profile from "./pages/Profile";
import About from "./pages/About";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";

// Components/Guards
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/admin/AdminRoute";
import BookPreviewModal from "./components/BookPreviewModal";

export default function App() {
  return (
    <>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute Public */}
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

          {/* Rute login User */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Rute Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute allowedRoles={["editor", "admin", "super_admin"]} />
          }
        >
          <Route element={<AdminLayout />}>
            {/* Redirect /admin langsung mengarah ke /admin/dashboard */}
            <Route index element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />

            {/* Rute Admin Lainnya */}
          </Route>
        </Route>
      </Routes>

      <BookPreviewModal />
    </>
  );
}
