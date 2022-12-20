const express = require("express");
const router = express();

const {
  createQuiz,
  getQuizes,
  getPublicQuizes,
  getQuizesBySearch,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getUserQuizes,
} = require("../controllers/quiz");

const {
  authenticateToken,
  regenerateAccessToken,
} = require("../middleware/auth");

router.get("/", authenticateToken, getQuizes)
router.post("/", authenticateToken, createQuiz);

router.get("/public", authenticateToken, getPublicQuizes);
router.get("/search", authenticateToken, getQuizesBySearch);

router.get("/:id", authenticateToken, getQuiz)
router.patch("/:id", authenticateToken, updateQuiz)
router.delete("/:id", authenticateToken, deleteQuiz)

router.get("/user/:id", authenticateToken, getUserQuizes)

router.post("/:quizId/questions", authenticateToken, addQuestion)
router.get("/:quizId/questions", authenticateToken, getQuestions)

router.get("/:quizId/questions/:questionId", authenticateToken, getQuestion)
router.patch("/:quizId/questions/:questionId", authenticateToken, updateQuestion)
router.delete("/:quizId/questions/:questionId", authenticateToken, deleteQuestion)

module.exports = router;