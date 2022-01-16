
const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');
const vipController = require('../controllers/vipController');

router.get('/api/qr_code', apiController.qr_code);
router.get('/', vipController.index);

module.exports = router;