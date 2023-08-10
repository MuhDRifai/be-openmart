const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');

dotenv.config();

// Middleware
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to DB Successfuly!');

    const PORT = process.env.PORT || 5000;

    // Routes
    app.use('/api/users', userRoute);
    app.use('/api/auth', authRoute); // Mengubah base URL untuk authRoute
    app.use('/api/product', productRoute);

    // Error Handling Middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ message: 'Something went wrong!' });
    });

    // Server Listening
    app.listen(PORT, () => {
        console.log(`App is running at http://localhost:${PORT}`);
    });
})
.catch((err) => {
    console.error('DB Connection Error:', err);
});
