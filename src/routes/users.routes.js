const express = require('express');
const userRouter = express.Router();
const userController = require(`../dao/db/controllers/userController`)
const upload = require('../config/multerConfig')
const authorize = require('../config/middlewares')


userRouter.get('/api/users', authorize, userController.getAllUsers)
userRouter.delete('/api/users', userController.deleteInactiveUsers);
userRouter.get('/api/users/premium/:uid', userController.getUserRole);
userRouter.put('/api/users/premium/:uid', userController.togglePremium);
userRouter.post('/api/users/:uid/documents', upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 1 },
    { name: 'identificacion', maxCount: 1 },
    { name: 'comprobante_domicilio', maxCount: 1 },
    { name: 'comprobante_estado_cuenta', maxCount: 1 }
]), userController.uploadDocuments);

module.exports = userRouter