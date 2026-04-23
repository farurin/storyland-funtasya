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

router.use(verifyToken, authorizeRoles("editor", "admin", "super_admin"));

// Konfigurasi field form gambar yang diterima
const uploadFields = upload.fields([
  { name: "image_icon", maxCount: 1 },
  { name: "image_banner", maxCount: 1 },
  { name: "image_card", maxCount: 1 },
]);

// router
router.get("/categories", getAdminCategories);
router.post("/categories", uploadFields, createCategory);
router.put("/categories/:id", uploadFields, updateCategory);
router.put("/categories/:id/status", updateCategoryStatus);
router.delete(
  "/categories/:id",
  authorizeRoles("admin", "super_admin"),
  deleteCategory,
);
router.get("/books", getAdminBooks);
router.post("/books", upload.any(), createBook);
router.get("/books/:id", getAdminBookDetail);
router.put("/books/:id/status", updateBookStatus);
router.put("/books/:id", upload.any(), updateBook);

module.exports = router;
