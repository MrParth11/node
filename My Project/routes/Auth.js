const express = require('express');
const router = express.Router();

const authController = require('../controller/Auth');
router.get("/",authController.loginform);
router.get('/logout', authController.logout);

router.post('/signup', authController.signup);
router.post('/login', authController.login);


module.exports = router;
