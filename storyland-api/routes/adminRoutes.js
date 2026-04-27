const express = require("express");
const router = express.Router();
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const { upload } = require("../config/cloudinary");

const {
  getAdminCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} = require("../controllers/adminCategoryController");

const {
  getAdminBooks,
  createBook,
  getAdminBookDetail,
  updateBookStatus,
  updateBook,
} = require("../controllers/adminBookController");

const {
  getAdminProfile,
  updateAdminProfile,
  updateAdminPassword,
} = require("../controllers/adminProfileController");

const {
  getDashboardStats,
} = require("../controllers/adminDashboardController");

const {
  getAllUsers,
  createAdminUser,
} = require("../controllers/adminUserController");

// Middleware Global untuk Rute Admin
router.use(verifyToken, authorizeRoles("editor", "admin", "super_admin"));

// Konfigurasi field form gambar yang diterima
const uploadFields = upload.fields([
  { name: "image_icon", maxCount: 1 },
  { name: "image_banner", maxCount: 1 },
  { name: "image_card", maxCount: 1 },
]);

// Helper Middleware untuk membatasi akses khusus
const adminOnly = authorizeRoles("admin", "super_admin");
const superAdminOnly = authorizeRoles("super_admin");

// ROUTES CATEGORY (Hanya Admin & Super Admin) ---
router.get("/categories", adminOnly, getAdminCategories);
router.post("/categories", adminOnly, uploadFields, createCategory);
router.put("/categories/:id", adminOnly, uploadFields, updateCategory);
router.put("/categories/:id/status", adminOnly, updateCategoryStatus);
router.delete("/categories/:id", adminOnly, deleteCategory);

// ROUTES BOOKS (Semua bisa akses) ---
router.get("/books", getAdminBooks);
router.post("/books", upload.any(), createBook);
router.get("/books/:id", getAdminBookDetail);
router.put("/books/:id/status", updateBookStatus);
router.put("/books/:id", upload.any(), updateBook);

// ROUTES PROFILE (Semua bisa akses) ---
router.get("/profile", getAdminProfile);
router.put("/profile", upload.any(), updateAdminProfile);
router.put("/profile/password", updateAdminPassword);

// ROUTES DASHBOARD (Semua bisa akses) ---
router.get("/dashboard", getDashboardStats);

// ROUTES MANAJEMEN PENGGUNA (Hanya Super Admin) ---
router.get("/users", superAdminOnly, getAllUsers);
router.post("/users", superAdminOnly, createAdminUser);

module.exports = router;
