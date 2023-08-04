const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto-js');
dotenv.config();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Enkripsi password menggunakan secret passphrase sebelum menyimpannya dalam database
        const encryptedPassword = crypto.AES.encrypt(password, process.env.SECRET_KEY).toString();

        const newUser = new User({
            username,
            email,
            password: encryptedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while registering user' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Dekripsi password yang disimpan dalam database menggunakan secret passphrase
        const decryptedStoredPassword = crypto.AES.decrypt(user.password, process.env.SECRET_KEY).toString(crypto.enc.Utf8);

        if (decryptedStoredPassword !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Buat token otentikasi menggunakan JWT_KEY dari berkas .env
        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});

module.exports = router;
