const express = require('express');
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const isNotAuth = require("../middleware/is-not-auth");
const authController = require('../controllers/auth');

router.get('/', isNotAuth, authController.authorize);

router.post('/login', isNotAuth, authController.login);
router.delete('/logout', isAuth, authController.logout);

router.get('/github', isNotAuth, authController.checkGitHub);

module.exports = router;