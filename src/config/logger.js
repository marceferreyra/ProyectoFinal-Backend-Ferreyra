const winston = require (`winston`)

const logger = winston.createLogger({
    transports:[
        new winston.transports.Console({level: "http"})
    ]
})


const addLogger = (req, res, next) => {
    req.logger = logger

    req.logger.http (`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)

    next();
} 

module.exports = addLogger