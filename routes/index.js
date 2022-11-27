const express = require("express");
const router = express.Router();

const mainController = require('../controllers');
router.get('/', mainController.getAll);

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));

module.exports = router;