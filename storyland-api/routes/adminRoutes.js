const express = require("express");
const router = express.Router();
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// Import Controller
const {
  getAdminCategories,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} = require("../controllers/adminCategoryController");

// Middleware global (untuk semua rute admin)
// 1. Harus Login (verifyToken)
// 2. Role harus editor, admin, atau super_admin (authorizeRoles)
router.use(verifyToken, authorizeRoles("editor", "admin", "super_admin"));

// rute kategori
router.get("/categories", getAdminCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.put("/categories/:id/status", updateCategoryStatus);

// Khusus Delete, batasi hanya super_admin (Opsional, sesuaikan kebutuha)
router.delete(
  "/categories/:id",
  authorizeRoles("admin", "super_admin"),
  deleteCategory,
);

module.exports = router;
