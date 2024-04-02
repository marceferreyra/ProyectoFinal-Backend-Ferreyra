const express = require('express');
const realTimeProductsController = require('../dao/db/controllers/realTimeproductsController');
const realTimeProductsRouter = express.Router();

realTimeProductsRouter.get('/', realTimeProductsController.getRealTimeProducts);

module.exports = realTimeProductsRouter;
