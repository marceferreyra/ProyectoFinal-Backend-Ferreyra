const express = require('express');
const chatController = require('../dao/db/controllers/chatController');
const authorize = require('../config/middlewares');

const router = express.Router();

router.get('/', authorize, chatController.getAllMessages);
router.post('/', chatController.createMessage);

module.exports = router;
