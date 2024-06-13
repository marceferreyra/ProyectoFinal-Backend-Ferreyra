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
    { name: 'identificacion', maxCount: 1 },
    { name: 'comprobante_domicilio', maxCount: 1 },
    { name: 'comprobante_estado_cuenta', maxCount: 1 }
]), userController.uploadDocuments);

module.exports = userRouter