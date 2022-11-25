const mongoose = require("mongoose")
const Leaderboard = require("../models/leaderboard")
const Quiz = require("../models/quiz")
const Game = require("../models/game")

const createLeaderboard = async (req, res) => {
  const { gameId, playerResultList } = req.body

  let game = await Game.findById(gameId)
  let quiz = await Quiz.findById(game.quizId)

  const leaderboard = new Leaderboard({
    gameId,
    playerResultList,
  })

  quiz.questionList.forEach((question) => {
    leaderboard.questionLeaderboard.push({
      questionIndex: question.questionIndex,
      questionResultList: [],
    })
    leaderboard.currentLeaderboard.push({
      questionIndex: question.questionIndex,
      leaderboardList: [],
    })
  })

  try {
    const newLeaderboard = await leaderboard.save()
    res.status(201).json(newLeaderboard)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getLeaderboard = async (req, res) => {
  let leaderboard
  try {
    leaderboard = await Leaderboard.findById(req.params.id)
    if (leaderboard == null) {
      return res.status(404).json({ message: "Leaderboard not found" })
    }
    res.json(leaderboard)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getWinnerLeaderboard = async (req, res) => {
  let leaderboard
  try {
    leaderboard = await Leaderboard.findById(req.params.id);
    if (leaderboard == null) {
      return res.status(404).json({ message: "Leaderboard not found" })
    }
    let n = leaderboard.currentLeaderboard.length;
    let currentLeaderboard = leaderboard.currentLeaderboard[n - 1];
    let nLeaderboard = currentLeaderboard.leaderboardList.length;
    for(let i = 0; i < nLeaderboard; i++) {
      for(let j = 0; j < (nLeaderboard - i - 1); j++) {
        if(currentLeaderboard.leaderboardList[j].playerCurrentScore < currentLeaderboard.leaderboardList[j+1].playerCurrentScore) {
          let temp = currentLeaderboard.leaderboardList[j];
          currentLeaderboard.leaderboardList[j] = currentLeaderboard.leaderboardList[j + 1];
          currentLeaderboard.leaderboardList[j + 1] = temp;
        }
      }
    }

    const winnerLeaderboard = {
      gameId: leaderboard.gameId,
      currentLeaderboard: currentLeaderboard
    }

    res.json(winnerLeaderboard)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const addPlayerResult = async (req, res) => {
  const { leaderboardId } = req.params
  const { playerResultId } = req.body
  let leaderboard

  try {
    leaderboard = await Leaderboard.findById(leaderboardId)
    leaderboard.playerResultList.push(playerResultId)
    const newLeaderboard = await leaderboard.save()
    res.status(201).json(newLeaderboard)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const updateQuestionLeaderboard = async (req, res) => {
  const { leaderboardId } = req.params
  const { questionIndex, playerId, playerPoints } = req.body
  let leaderboard

  try {
    leaderboard = await Leaderboard.findById(leaderboardId)
    console.log(leaderboard)
    leaderboard.questionLeaderboard[questionIndex - 1].questionResultList.push({
      playerId,
      playerPoints,
    })

    const newLeaderboard = await leaderboard.save()
    res.status(201).json(newLeaderboard)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const updateCurrentLeaderboard = async (req, res) => {
  const { leaderboardId } = req.params
  const { questionIndex, playerId, playerCurrentScore } = req.body
  let leaderboard

  try {
    leaderboard = await Leaderboard.findById(leaderboardId)
    leaderboard.currentLeaderboard[questionIndex - 1].leaderboardList.push({
      playerId,
      playerCurrentScore,
    })

    const newLeaderboard = await leaderboard.save()
    res.status(201).json(newLeaderboard)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  createLeaderboard,
  getLeaderboard,
  getWinnerLeaderboard,
  addPlayerResult,
  updateQuestionLeaderboard,
  updateCurrentLeaderboard,
}
