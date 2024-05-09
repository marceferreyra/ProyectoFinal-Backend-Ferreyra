const express = require('express');
const loggerTestRouter = express.Router();
const loggerTestController = require('../dao/db/controllers/loggerTestController');

const loggerMiddleware = require('../config/logger');


loggerTestRouter.get('/loggerTest', loggerMiddleware, loggerTestController.testLogger);

module.exports = loggerTestRouter;