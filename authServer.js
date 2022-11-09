require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const helmet = require("helmet");
const compression = require("compression");
const config = require("./config/index");

const { allowedAuthDomains } = config;

const app = express();

const authRouter = require("./routes/auth");

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

app.use(express.json({limit: '5mb'}));
app.use(cors({domains: allowedAuthDomains, credentials:true}));
app.use(helmet());
app.use(compression());

app.use("/api/auth", authRouter);

const server = http.createServer(app);

server.listen(process.env.AUTH_PORT, () => {
  console.log(`Server started on port ${process.env.AUTH_PORT}`);
})