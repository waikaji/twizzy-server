const express = require("express");
const router = express();

const {
  createPlayerResult,
  getPlayerResults,
  getPlayerResult,
  updatePlayerResult,
  deletePlayerResult,
  addAnswer,
  getAnswers,
  getAnswer,
  updateAnswer,
  deleteAnswer,
} = require("../controllers/playerResult");

const {
  authenticateToken,
  regenerateAccessToken,
} = require("../middleware/auth");

router.get("/", authenticateToken, getPlayerResults)
router.post("/", authenticateToken, createPlayerResult)

router.get("/:id", authenticateToken, getPlayerResult)
router.patch("/:id", authenticateToken, updatePlayerResult)
router.delete("/:id", authenticateToken, deletePlayerResult)

router.patch("/:playerResultId/answers", authenticateToken, addAnswer)
router.get("/:playerResultId/answers", authenticateToken, getAnswers)

router.get("/:playerResultId/answers/:answerId", authenticateToken, getAnswer)
router.patch("/:playerResultId/answers/:answerId", authenticateToken, updateAnswer)
router.delete("/:playerResultId/answers/:answerId", authenticateToken, deleteAnswer)

module.exports = router;