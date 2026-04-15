const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

const {
  getCategories,
  getBooks,
  getBookPages,
  finishBook,
  getBookStatus,
  toggleFavorite,
  toggleSaved,
  updateProgress,
} = require("../controllers/bookController");

router.get("/categories", getCategories);
router.get("/books", getBooks);
router.get("/books/:id/pages", getBookPages);

router.post("/books/:id/finish", verifyToken, finishBook);
router.get("/books/:id/status", verifyToken, getBookStatus);
router.post("/books/:id/favorite", verifyToken, toggleFavorite);
router.post("/books/:id/save", verifyToken, toggleSaved);
router.post("/books/:id/progress", verifyToken, updateProgress);

module.exports = router;
