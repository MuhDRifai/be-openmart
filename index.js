const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth')

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('DB Connected');
  const PORT = process.env.PORT || 5000;

  app.use(express.json());
  app.use('/api/users', userRoute);
  app.use('/api/users', authRoute);

  app.listen(PORT, () => {
    console.log(`Aplikasi berjalan di http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('DB Connection Error:', err);
});
