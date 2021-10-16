
import { Response, NextFunction } from 'express';
import { RequestCustom } from '../../../intefaces';

import { Config } from '../../../models';
import { loadConfig } from '../../../loaders/config.loader';
import localDict from '../../../helpers/dict';
import * as services from '../../../services';
import sendResponse from '../../../utils/sendResponse';
import { IAdmin } from '../../../intefaces';

const gettingStarted = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
        const config = await services.config.create(req.body);
        return sendResponse({ res, status: 200, response: { result: { config } } });
    } catch (err) {
        next(err)
    }
}


const createSuperAdmin = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
        req.body.role = 'super-admin';
        if (req.body.email) {
            req.body.emailVerified = true;
        }
        if (req.body.phone) {
            req.body.phoneVerified = true;
        }
        const config = await Config.findOne({}).sort({ createdAt: -1 });
        if (!config) {
            throw new Error(localDict.fa.errors.configNotFound);
        }
        const admin = await services.admin.create(req.body);

        await loadConfig();
        return sendResponse({ res, status: 200, response: { result: { config, admin } } });
    } catch (err) {
        next(err)
    }
}

const update = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
        const config = await services.config.update(req.body);
        return sendResponse({ res, status: 200, response: { result: { config } }, token: req.token });
    } catch (err) {
        next(err)
    }
}


const get = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
        const config = await services.config.get();
        return sendResponse({ res, status: 200, response: { result: { config } }, token: req.token });
    } catch (err) {
        next(err)
    }
}


const updateLogo = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
        req.body.logo = req.body.image;
        const config = await services.config.updateLogo(req.body);
        return sendResponse({ res, status: 200, response: { result: { config } }, token: req.token });
    } catch (err) {
        next(err)
    }
}

const updateFavicon = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
        const config = await services.config.updateFavicon(req.body);
        return sendResponse({ res, status: 200, response: { result: { config } }, token: req.token });
    } catch (err) {
        next(err)
    }
}


export default {
    gettingStarted,
    createSuperAdmin,
    update,
    get,
    updateLogo,
    updateFavicon
};