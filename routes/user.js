const express = require("express");
const CryptoJs = require("crypto-js");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const User = require("../models/User");
const router = express.Router();

// Update User
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user data based on request body
    if (req.body.password) {
      const encryptedPassword = CryptoJs.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();

      req.body.password = encryptedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    // Remove sensitive fields from the response
    const { password, ...others } = updatedUser._doc;

    res.status(200).json(others);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: "Update failed" }); // Menggunakan pesan kesalahan yang lebih spesifik
  }
});

//Delete User
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been Deleted..");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get User By Id
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc; // Menggunakan _doc untuk mengakses data dokumen
    res.status(200).json(others); // Mengirimkan data tanpa password
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All User
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new; // Mengambil nilai parameter query "new" dari permintaan
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(1) 
      : await User.find(); // Mengambil data pengguna terbaru yang terbatas hanya satu data
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get User Stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
