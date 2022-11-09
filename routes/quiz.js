const express = require("express");
const router = express.Router();

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

router
  .route("/")
  .get(getQuizes)
  .post(createQuiz);

router.get("/public", getPublicQuizes);
router.get("/search", getQuizesBySearch);

router
  .route("/:id")
  .get(getQuiz)
  .patch(updateQuiz)
  .delete(deleteQuiz)

router.get("/user/:id", getUserQuizes)

router
  .route("/:quizId/questions")
  .post(addQuestion)
  .get(getQuestions);

router
  .route("/:quizId/questions/:questionId")
  .get(getQuestion)
  .patch(updateQuestion)
  .delete(deleteQuestion)

module.exports = router;