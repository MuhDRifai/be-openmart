const express = require("express");
const router = express.Router();
const CryptoJs = require("crypto-js");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

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
      return res.status(401).json({ error: "Username or Password is incorrect" });
    }
      
    const decryptedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.SECRET_KEY
    ).toString(CryptoJs.enc.Utf8);

    if (decryptedPassword !== req.body.password) {
      return res.status(401).json({ error: "Username or Password is incorrect" });
    }

    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin,
    }, process.env.JWT_KEY, {
      expiresIn: '3d'
    });

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    res.status(500).json({
      error: "Login failed",
    });
  }
});

module.exports = router;
