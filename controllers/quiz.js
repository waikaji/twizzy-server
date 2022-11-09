const mongoose = require("mongoose");
const Quiz = require("../models/quiz");

const createQuiz = async (req, res) => {
  const {
    title,
    backgroundImage,
    description,
    creatorID,
    creatorName,
    pointsPerQuestion,
    isPublic,
    questionList,
  } = req.body;
  const quiz = new Quiz({
    title,
    backgroundImage,
    description,
    creatorID,
    creatorName,
    pointsPerQuestion,
    numberOfQuestions: questionList.length,
    isPublic,
    questionList,
    dateCreated: new Date().toISOString(),
  });

  try {
    const newQuiz = await quiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getQuizes = async (req, res) => {
  try {
    const quizes = await Quiz.find();
    res.status(200).send(quizes);
  } catch (error) {
    res.status(500).josn({ message: error.message });
  }
}

const getPublicQuizes = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT;

    const total = await Quiz.find({ isPublic: true }). countDocuments({});
    const quizes = await Quiz.find({ isPublic: true })
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    
    res.status(200).send({
      data: quizes,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getUserQuizes = async (req, res) => {
  const userId = req.params.id;
  try {
    const quizes = await Quiz.find({ creatorID: userId });
    res.status(200).send(quizes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getQuiz = async (req, res) => {
  let quiz;
  try {
    quiz = await Quiz.findById(req.params.id);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found"});
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteQuiz = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No quiz with id: ${id}`);
  }

  try {
    await Quiz.findByIdAndRemove(id);
    res.json({ message: "Quiz deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateQuiz = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No quiz with id: ${id}`);
  }

  const {
    title,
    backgroundImage,
    description,
    pointsPerQuestion,
    isPublic,
    questionList,
  } = req.body;

  const quiz = new Quiz({
    _id: id,
    title,
    backgroundImage,
    description,
    pointsPerQuestion,
    numberOfQuestions: questionList.length,
    isPublic,
    questionList,
    dateCreated: new Date().toISOString(),
  });


  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, quiz, { new: true });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const addQuestion = async (req, res) => {
  const { quizId } = req.params;
  const {
    questionType,
    question,
    pointType,
    answerTime,
    answerList,
    correctAnswersList,
  } = req.body;
  let quiz;
  try {
    quiz = await Quiz.findById(quizId);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    quiz.questionList.push({
      questionType,
      question,
      pointType,
      answerTime,
      answerList,
      correctAnswersList,
    });
    quiz.numberOfQuestions += 1;
    const updatedQuiz = await quiz.save();
    res.send(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getQuestions = async (req, res) => {
  const { quizId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found "});
    }
    res.status(200).send(quiz.questionList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const question = quiz.questionList.id(questionId);
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(404).send(`No quiz with id: ${quizId}`);
  }
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send(`No question with id: ${questionId}`);
  }
  const quiz = await Quiz.findById(quizId);

  try {
    let questionIndex = quiz.questionList.findIndex(
      (obj) => obj._id == questionId
    )
    quiz.questionList.splice(questionIndex, 1);
    quiz.numberOfQuestions -= 1;
    await Quiz.findByIdAndUpdate(quizId, quiz, {
      new: true,
    })
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(404).send(`No quiz with id: ${quizId}`);
  }
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send(`No question with id: ${questionId}`);
  }

  const {
    questionType,
    question,
    pointType,
    answerTime,
    answerList,
    correctAnswersList,
  } = req.body;
  let quiz;

  try {
    quiz = await Quiz.findById(quizId);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    let questionIndex = quiz.questionList.findIndex(
      (obj) => obj._id == questionId
    )
    quiz.questionList[questionIndex] = {
      _id: questionId,
      questionType,
      question,
      pointType,
      answerTime,
      answerList,
      correctAnswer,
      correctAnswersList,
    }
    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, quiz, {
      new: true,
    })
    res.send(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const getQuizesBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");

    const quizes = await Quiz.find({
      isPublic: true,
      $or: [{ title }],
    })

    res.status(200).send(quizes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = {
  createQuiz,
  getQuizes,
  getPublicQuizes,
  getUserQuizes,
  getQuizesBySearch,
  getQuiz,
  deleteQuiz,
  updateQuiz,
  addQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
}