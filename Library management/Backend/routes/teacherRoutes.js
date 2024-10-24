const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// Get all students
router.get('/students', teacherController.getAllStudents);

module.exports = router;