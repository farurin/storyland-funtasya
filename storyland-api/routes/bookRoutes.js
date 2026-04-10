const express = require("express");
const router = express.Router();
const {
  getCategories,
  getBooks,
  getBookPages,
} = require("../controllers/bookController");

router.get("/categories", getCategories);
router.get("/books", getBooks);
router.get("/books/:id/pages", getBookPages);

module.exports = router;
