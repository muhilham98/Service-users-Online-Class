const express = require('express');
const router = express.Router();
const apiUserController = require('../controllers/apiUserController');

/* GET users listing. */
router.post('/register', apiUserController.register);
router.post('/login', apiUserController.login);
router.put('/:id', apiUserController.update);
router.get('/:id', apiUserController.getUser);
router.get('/', apiUserController.getUsers);
router.post('/logout', apiUserController.logout);

module.exports = router;
