const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkToken = require('../middlewares/checkToken');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/change-password', userController.changePassword);
router.get('/user/:id', checkToken, userController.getUser);

module.exports = router;
