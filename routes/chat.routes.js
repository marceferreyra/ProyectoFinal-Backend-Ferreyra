const express = require('express');
const chatController = require('../src/dao/db/controllers/chatController');

const router = express.Router();

router.get('/', chatController.getAllMessages);
router.post('/', chatController.createMessage);

module.exports = router;
