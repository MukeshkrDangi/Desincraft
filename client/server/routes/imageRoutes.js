const express = require('express');
const router = express.Router();
const { removeBackground } = require('../controllers/imageController');

router.post('/remove-bg', removeBackground);

module.exports = router;
