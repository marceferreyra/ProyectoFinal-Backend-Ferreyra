const loggerMiddleware  = require('../../../config/logger');

exports.testLogger = async (req, res) => {
    try {
        req.logger.debug('This is a debug message');
        req.logger.info('This is an info message');
        req.logger.warning('This is a warning message');
        req.logger.error('This is an error message');
        req.logger.fatal('This is a fatal message');

        res.status(200).json({ message: 'Logs have been tested successfully' });
    } catch (error) {
        req.logger.error('Error while testing logs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
