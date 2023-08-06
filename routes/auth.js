const express = require("express");
const router = express.Router();
const CryptoJs = require("crypto-js");
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  try {
    const encryptedPassword = CryptoJs.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString();

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: encryptedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Registration failed",
    });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      return res.status(401).json("Invalid Username");
    }

    const decryptedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString(CryptoJs.enc.Utf8);

    if (decryptedPassword !== req.body.password) {
      return res.status(401).json("Invalid Password");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: "Login failed",
    });
  }
});

module.exports = router;
