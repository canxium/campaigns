const express = require('express');
const page = require('@controllers/page.controller');
const router = express.Router();

router.get('/', page.index);
router.post('/api/tx/:hash', page.submitTx);

module.exports = router;
