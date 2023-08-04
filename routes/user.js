const express = require('express');
const router = express.Router();
const verifyTokenAndAuthorization = require('./verifyToken');
const crypto = require('crypto-js'); // Impor modul crypto-js
const User = require('../models/User'); // Impor model User

// UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = crypto.AES.encrypt(
            req.body.password,
            process.env.SECRET_KEY
        ).toString();
    }
    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        );
        res.json(updateUser); // Mengirimkan respons dengan data pengguna yang diperbarui
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating user' });
    }
});

module.exports = router;
