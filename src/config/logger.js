const winston = require('winston');
const config = require(`./config`);

const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
};

const colors = {
    fatal: 'magenta',
    error: 'red',
    warning: 'yellow',
    info: 'cyan',
    http: 'green',
    debug: 'blue'
};

const devLogger = winston.createLogger({
    levels: levels,
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: 'error'
        })
    ]
});

const prodLogger = winston.createLogger({
    levels: levels,
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: 'info'
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error'
        })
    ]
});

winston.addColors(colors);

const loggerMiddleware = (req, res, next) => {
    if (config.environment === 'production') {
        req.logger = prodLogger;
    } else {
        req.logger = devLogger;
    }

    next();
};

module.exports = loggerMiddleware;


