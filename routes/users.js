const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users');

router.get('/', usersController.getAll);
router.get('/:username', usersController.getSingle);

router.post('/', usersController.insertUser);
router.put('/:username', usersController.updateContact);
router.delete('/:username', usersController.deleteContact);

module.exports = router;