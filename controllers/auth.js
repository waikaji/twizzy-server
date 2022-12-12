require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const user = await User.findOne({ userName: req.body.userName });
  if (user == null) {
    return res.status(400).send({message: "Your username and password do not match"});
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = generateAccessToken({
        userName: user.userName,
        _id: user._id,
      });
      const refreshToken = jwt.sign(
        { userName: user.userName, id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        // { expiresIn: "2h" }
      );
      const result = {
        userName: user.userName,
        _id: user._id,
      }
      res.json({
        result,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      res.status(400).send({message: "Your username and password do not match"});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    confirmPassword,
  } = req.body;

  const existingEmail = await User.findOne({ email });
  const existingUserName = await User.findOne({ userName });

  if (existingEmail) {
    return res.status(400).json({ message: {email: "Email already exists." }});
  }

   if (existingUserName) {
    return res.status(400).json({ message: {username: "Username already exists." }});
  }

  if (password.length < 8) {
    return res.status(400).json({ message: { password: "Password must be longer than 7 characters" }});
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: { password: "Passwords don't match." }});
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
    firstName,
    lastName,
    userName,
    email,
    password: hashedPassword,
  });

  try {
    const newUser = await user.save();
    const accessToken = generateAccessToken({
      userName: user.userName,
      _id: user._id,
    });

    const refreshToken = jwt.sign(
      { userName: user.userName, id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      // { expiresIn: "2h" }
    );
    const result = {
      userName: user.userName,
      _id: user._id,
    }
    res.status(201).json({
      result,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const generateAccessToken = (userData) => {
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, 
    // {expiresIn: "25m"},
  );
};

module.exports = { login, register };