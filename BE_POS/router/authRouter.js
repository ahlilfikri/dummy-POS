const express = require('express');
const router = express.Router();

const loginController = require('../controller/authController/loginController');
const logoutController = require('../controller/authController/logoutController');
const { protect } = require('../middlewares/UserAuthentication');

router.post('/login', loginController.loginKasir);
// http://localhost:3876/be/api/pos/auth/login


router.post('/logout', protect, logoutController.logoutKasir);
// http://localhost:3876/be/api/pos/auth/logout

module.exports = router;
