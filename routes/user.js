const express = require("express");
const router = express();

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");

const {
  authenticateToken,
  regenerateAccessToken,
} = require("../middleware/auth");

router.get("/", authenticateToken, getUsers)
router.post("/", authenticateToken, createUser);

router.get("/:id", authenticateToken, getUser)
router.patch("/:id", authenticateToken, updateUser)
router.delete("/:id", authenticateToken, deleteUser);

module.exports = router;