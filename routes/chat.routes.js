const express = require('express');
const chatManager = require('../dao/chatManager');
const router = express.Router();

router.get('/', (req, res) => {
   
    res.render('layouts/chat');
});

module.exports = router;
