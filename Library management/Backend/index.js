const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const db = require('./config/db'); // Import the database module

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB using the db module
db();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);
app.use('/teacher', teacherRoutes);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Protected routes (example for admin)
app.get('/admin/dashboard', authenticateToken, (req, res) => {
  console.log(req.user);
  res.send('Admin dashboard');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
