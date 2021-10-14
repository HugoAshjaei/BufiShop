import { Response, NextFunction } from 'express';
import { RequestCustom } from '../../intefaces';
import jwt from 'jsonwebtoken';
import config from '../../config';
import localDict from '../../helpers/dict';

export async function verify(req: RequestCustom, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
        // verify RS256 token
        const decoded = await jwt.verify(token, config.jwtSecret);
        req.token = token;
        req.user = decoded;
        return next();
    } catch (err) {
        res.statusCode = 401;
        throw new Error(localDict.fa.errors.tokenNotFound);
        
    }

}

export async function isAdmin(req: RequestCustom, res: Response, next: NextFunction) {
    const { user } = req;

    if (user.role !== 'admin' && user.role !== 'super-admin') {
        res.statusCode = 405;
        throw new Error(localDict.fa.errors.notPermitted);
    }
    return next();
}

export async function isSuperAdmin(req: RequestCustom, res: Response, next: NextFunction) {
    const { user } = req;

    if (user.role !== 'super-admin') {
        res.statusCode = 405;
        throw new Error(localDict.fa.errors.notPermitted);
    }
    return next();
}