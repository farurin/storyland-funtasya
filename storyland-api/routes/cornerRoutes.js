const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  getFavorites,
  getSaved,
  getHistory,
} = require("../controllers/cornerController");

// middleware login
router.get("/favorites", verifyToken, getFavorites);
router.get("/saved", verifyToken, getSaved);
router.get("/history", verifyToken, getHistory);

module.exports = router;
