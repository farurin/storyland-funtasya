import { Routes, Route, Navigate } from "react-router-dom";
import { AdminToastProvider } from "./context/AdminToastContext";

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
import AdminBooks from "./pages/admin/AdminBooks";
import AdminAddBook from "./pages/admin/AdminAddBook";
import AdminBookDetail from "./pages/admin/AdminBookDetail";
import AdminEditBook from "./pages/admin/AdminEditBook";
import AdminProfileSettings from "./pages/admin/AdminProfileSettings";
import AdminPerpustakaan from "./pages/admin/AdminPerpustakaan";
import AdminBackupExport from "./pages/admin/AdminBackupExport";
import AdminUsers from "./pages/admin/AdminUsers";

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
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/corner" element={<Corner />} />
          <Route path="/about" element={<About />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Rute Admin (Semua yang punya akses panel) */}
        <Route
          path="/admin"
          element={
            <AdminRoute allowedRoles={["editor", "admin", "super_admin"]} />
          }
        >
          <Route
            element={
              <AdminToastProvider>
                <AdminLayout />
              </AdminToastProvider>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />

            {/* Bisa diakses SEMUA (Editor, Admin, Super Admin) */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="books/:id" element={<AdminBookDetail />} />
            <Route path="tambah" element={<AdminAddBook />} />
            <Route path="books/:id/edit" element={<AdminEditBook />} />
            <Route path="perpustakaan" element={<AdminPerpustakaan />} />
            <Route path="settings" element={<AdminProfileSettings />} />

            {/* Dilarang untuk Editor (Hanya Admin & Super Admin) */}
            <Route
              element={<AdminRoute allowedRoles={["admin", "super_admin"]} />}
            >
              <Route path="categories" element={<AdminCategories />} />
              <Route path="backup" element={<AdminBackupExport />} />
            </Route>

            {/* Dilarang untuk Editor & Admin (Hanya Super Admin) */}
            <Route element={<AdminRoute allowedRoles={["super_admin"]} />}>
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Route>
        </Route>
      </Routes>

      <BookPreviewModal />
    </>
  );
}
