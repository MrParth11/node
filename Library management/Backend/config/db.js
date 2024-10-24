const mongoose = require('mongoose');

const db = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/library', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = db;
