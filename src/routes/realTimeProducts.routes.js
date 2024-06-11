const express = require('express');
const realTimeProductsController = require('../dao/db/controllers/realTimeproductController');
const realTimeProductsRouter = express.Router();
const authorize = require('../config/middlewares');

realTimeProductsRouter.get('/', authorize ,realTimeProductsController.getRealTimeProducts);

module.exports = realTimeProductsRouter;
