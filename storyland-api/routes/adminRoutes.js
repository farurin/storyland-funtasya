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

router.use(verifyToken, authorizeRoles("editor", "admin", "super_admin"));

// Konfigurasi field form gambar yang diterima
const uploadFields = upload.fields([
  { name: "image_icon", maxCount: 1 },
  { name: "image_banner", maxCount: 1 },
  { name: "image_card", maxCount: 1 },
]);

// router

// category
router.get("/categories", getAdminCategories);
router.post("/categories", uploadFields, createCategory);
router.put("/categories/:id", uploadFields, updateCategory);
router.put("/categories/:id/status", updateCategoryStatus);
router.delete(
  "/categories/:id",
  authorizeRoles("admin", "super_admin"),
  deleteCategory,
);

// books
router.get("/books", getAdminBooks);
router.post("/books", upload.any(), createBook);
router.get("/books/:id", getAdminBookDetail);
router.put("/books/:id/status", updateBookStatus);
router.put("/books/:id", upload.any(), updateBook);

// profile
router.get("/profile", getAdminProfile);
router.put("/profile", upload.any(), updateAdminProfile);
router.put("/profile/password", updateAdminPassword);

module.exports = router;
