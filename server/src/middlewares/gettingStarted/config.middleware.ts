import { Request, Response, NextFunction } from 'express';
import localDict from '../../helpers/dict';

export async function isFirstTime(req: Request, res: Response, next: NextFunction) {
  if (global.CONFIG.firstTimeUsage) {
    await next();
  } else {
    res.statusCode = 403;
    throw new Error(localDict.fa.errors.notFirstTime);
  }
}