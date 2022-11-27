const express = require('express');
const router = express.Router();
const isAuth = require("../middleware/is-auth");

const usersController = require('../controllers/users');

router.get('/', usersController.getAll);
router.get('/:username', usersController.getSingle);

router.post('/', usersController.insertUser);
router.put('/:username', isAuth, usersController.updateContact);
router.delete('/:username', isAuth, usersController.deleteContact);

module.exports = router;