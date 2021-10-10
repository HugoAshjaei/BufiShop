import winston from 'winston'

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: `logs/error/${new Date().toISOString().slice(0, 10)}.log`, level: 'error' }),
        new winston.transports.File({ filename: `logs/combined/${new Date().toISOString().slice(0, 10)}.log` }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export default logger