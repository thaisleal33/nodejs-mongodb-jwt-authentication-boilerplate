const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkToken = require('../middlewares/checkToken');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

router.get('/user/:id', checkToken, userController.getUser);

router.put('/change-password', checkToken, userController.changePassword);
router.put('/user/:id', checkToken, userController.updateUser );

router.delete('/user/:id', checkToken, userController.deleteUser);

module.exports = router;
