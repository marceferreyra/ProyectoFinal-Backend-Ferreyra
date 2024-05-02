const express = require('express');
const mockingController = require('../dao/db/controllers/mockingController');
const mockingRouter = express.Router();

mockingRouter.get('/mockingproducts', mockingController.getMockingProducts);

module.exports = mockingRouter;