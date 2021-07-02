const express = require('express');
const router = express.Router();
const apiRefreshTokensController = require('../controllers/apiRefreshTokensController');

/* GET users listing. */
router.post('/create', apiRefreshTokensController.create);
router.get('/', apiRefreshTokensController.getToken);


module.exports = router;
