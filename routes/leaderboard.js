const express = require("express");
const router = express();

const {
  createLeaderboard,
  getLeaderboard,
  addPlayerResult,
  updateQuestionLeaderboard,
  updateCurrentLeaderboard,
  getWinnerLeaderboard,
} = require("../controllers/leaderboard");

const {
  authenticateToken,
  regenerateAccessToken,
} = require("../middleware/auth");

router.post("/", createLeaderboard);

router.patch("/:leaderboardId/playerresult", authenticateToken, addPlayerResult);

router.patch("/:leaderboardId/questionleaderboard", authenticateToken, updateQuestionLeaderboard)

router.patch("/:leaderboardId/currentleaderboard", authenticateToken, updateCurrentLeaderboard)

router.get("/:id", authenticateToken, getLeaderboard)

router.get("/winnerLeaderboard/:id", authenticateToken, getWinnerLeaderboard)

module.exports = router;