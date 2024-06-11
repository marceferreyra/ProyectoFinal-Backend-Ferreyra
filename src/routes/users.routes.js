const express = require('express');
const userRouter = express.Router();
const userController = require(`../dao/db/controllers/userController`)
const upload = require('../config/multerConfig')

userRouter.get('/api/users/premium/:uid', userController.renderPremiumPage);
userRouter.put('/api/users/premium/:uid', userController.togglePremium);
userRouter.get('/api/users/:uid/documents', userController.renderPremiumDocumentsPage);
userRouter.post('/api/users/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 1 },
    { name: 'document', maxCount: 3 }
]), userController.uploadDocuments);

module.exports = userRouter