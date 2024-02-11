const express = require('express');
const chatManager = require('../src/dao/db/chatManager');
const router = express.Router();

router.get('/', (req, res) => {
   
    res.render('layouts/chat');
});

module.exports = router;
