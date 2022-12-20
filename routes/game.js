const express = require("express");
const router = express();

const {
  createGame,
  getGames,
  getGame,
  updateGame,
  deleteGame,
  addPlayer,
} = require("../controllers/game");

const {
  authenticateToken,
  regenerateAccessToken,
} = require("../middleware/auth");

router.get("/", authenticateToken, getGames)
router.post("/", authenticateToken, createGame)

router.patch("/:gameId/players", authenticateToken, addPlayer)

router.get("/:id", authenticateToken, getGame)
router.patch("/:id", authenticateToken, updateGame)
router.delete("/:id", authenticateToken, deleteGame)

module.exports = router;