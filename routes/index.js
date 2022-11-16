const express = require("express");
const router = express.Router();

const mainController = require('../controllers');
router.get('/', mainController.getAll);

module.exports = router;