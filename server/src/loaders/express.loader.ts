import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../routes';
import cookieParser from 'cookie-parser';
import config from '../config';
import localDict from '../helpers/dict';
import { log } from 'console';
import sendResponse from '../utils/sendResponse';
import logger from '../utils/logger';

export default ({ app }: { app: express.Application }) => {
    /**
     * Health Check endpoints
     */
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy');

    app.use(cors({
        origin: (origin, callback) => {
            if (config.origins && origin && config.origins.indexOf(origin) > -1) {
                callback(null, true);
            } else {
                callback(null, true);
                // callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }));

    // Middleware that transforms the raw string of req.body into json
    app.use(bodyParser.json());

    // Middleware to read cookies for the httponly token
    app.use(cookieParser());

    // Load locale

    // Load API routes
    app.use(routes());

    // catch 404 and forward to error handler
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        const err = new Error(localDict.fa.errors.notFound);
        res.statusCode = 404;
        next(err);
    });

    // error handling
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        // logs
        if (res.statusCode == 200) {
            res.statusCode = 500;
        }
        if (res.statusCode == 500) {
            logger.error(new Date() + ' - ' +err.message);
        } else {
            logger.info(new Date() + ' - ' +err.message);
        }
        sendResponse({
            response: {
                errors: err.message || localDict.fa.errors.internalServerError
            },
            status: Number(res.statusCode) || 500,
            res
        })
    });
};