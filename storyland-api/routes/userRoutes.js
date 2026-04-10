const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  getCharacters,
  updateActiveCharacter,
  getUserProfile,
  getLeaderboard,
} = require("../controllers/userController");

router.get("/characters", verifyToken, getCharacters);
router.put("/characters/active", verifyToken, updateActiveCharacter);
router.get("/profile", verifyToken, getUserProfile);
router.get("/leaderboard", verifyToken, getLeaderboard);

module.exports = router;
