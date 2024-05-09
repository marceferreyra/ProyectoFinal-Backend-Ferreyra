const loggerMiddleware  = require('../../../config/logger');

exports.testLogger = async (req, res) => {
    try {
        req.logger.debug('This is a debug message');
        req.logger.info('This is an info message');
        req.logger.warning('This is a warning message');
        req.logger.error('This is an error message');
        req.logger.fatal('This is a fatal message');

        res.status(200).json({ message: 'Todos los logs fueron probados con éxito' });
    } catch (error) {
        req.logger.error('Error al probar los logs:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
