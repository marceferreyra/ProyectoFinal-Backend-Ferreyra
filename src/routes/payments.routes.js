const express = require('express');
const paymentRouter = express.Router();
const paymentController = require('../dao/db/controllers/paymentController')


paymentRouter.post('/process-payment/:cid', paymentController.processPayment);

module.exports = paymentRouter;