const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const {
  getCharacters,
  updateActiveCharacter,
  getUserProfile,
  getLeaderboard,
  getMissions,
  claimMission,
} = require("../controllers/userController");

router.get("/characters", verifyToken, getCharacters);
router.put("/characters/active", verifyToken, updateActiveCharacter);
router.get("/profile", verifyToken, getUserProfile);
router.get("/leaderboard", verifyToken, getLeaderboard);
router.get("/missions", verifyToken, getMissions);
router.post("/missions/:id/claim", verifyToken, claimMission);

module.exports = router;
