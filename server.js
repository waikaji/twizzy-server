require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const helmet = require("helmet");
const compression = require("compression");
const config = require("./config/index");

const { allowedDomains } = config;

const app = express();

const {
  authenticateToken,
  regenerateAccessToken,
} = require("./middleware/auth");

const quizRouter = require("./routes/quiz");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const gameRouter = require("./routes/game");
const playerResultRouter = require("./routes/playerResult");
const leaderboardRouter = require("./routes/leaderboard");


mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

app.use(express.json({limit: '5mb'}));
app.use(cors({domains: allowedDomains, credentials:true}));
app.use(helmet());
app.use(compression());
app.use(authenticateToken);
// app.use(regenerateAccessToken);

app.use("/api/quizes", quizRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/games", gameRouter);
app.use("/api/playerResults", playerResultRouter);
app.use("/api/leaderboard", leaderboardRouter);

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
})