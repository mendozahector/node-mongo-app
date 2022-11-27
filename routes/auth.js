const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

router.get('/', authController.authorize);

router.post('/login', authController.login);
router.delete('/logout', authController.logout);

router.get('/github', authController.checkGitHub);

module.exports = router;