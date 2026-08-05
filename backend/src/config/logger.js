const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: process.env.LOGGER_LEVEL || "debug",

    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack }) => {
            if (stack) {
                return `${timestamp} [${level.toUpperCase()}] ${stack}`;
            }

            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),

    transports: [
        new transports.Console()
    ]
});

module.exports = {logger};