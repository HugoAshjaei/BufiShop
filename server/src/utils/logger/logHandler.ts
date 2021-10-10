import logger from "./index";
import { NextFunction, Request, Response } from 'express'
const logHandler = (req: Request, res: Response, next: NextFunction): void => {
    logger.info(`${new Date()} - ${res.statusCode} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    next()
};
export default logHandler