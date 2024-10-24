const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get all users
router.get('/users', adminController.getAllUsers);

// Get all books
router.get('/books', adminController.getAllBooks);

// Add a new user
router.post('/users', adminController.addUser);

// Add a new book
router.post('/books', adminController.addBook);

// Update a user
router.put('/users/:id', adminController.updateUser);

// Update a book
router.put('/books/:id', adminController.updateBook);

// Delete a user
router.delete('/users/:id', adminController.deleteUser);

// Delete a book
router.delete('/books/:id', adminController.deleteBook);

module.exports = router;