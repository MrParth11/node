const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Get all books
router.get('/books', studentController.getAllBooks);

module.exports = router;