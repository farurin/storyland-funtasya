const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

const {
  getCategories,
  getBooks,
  getBookPages,
  finishBook,
} = require("../controllers/bookController");

router.get("/categories", getCategories);
router.get("/books", getBooks);
router.get("/books/:id/pages", getBookPages);

router.post("/books/:id/finish", verifyToken, finishBook);

module.exports = router;
