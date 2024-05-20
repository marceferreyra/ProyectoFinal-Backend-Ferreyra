const express = require('express');
const userRouter = express.Router();
const userController = require(`../dao/db/controllers/userController`)

userRouter.get('/premium/:uid', userController.renderPremiumPage);
userRouter.put('/premium/:uid', userController.togglePremium);

module.exports = userRouter