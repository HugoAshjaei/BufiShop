
import { Request, Response, NextFunction } from 'express';
import { Config, Admin } from '../../../models';
import { loadConfig } from '../../../loaders/config.loader';
import localDict from '../../../helpers/dict';
import * as services from '../../../services';

const gettingStarted = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await services.config.create(req.body);

        res.status(200).json({
            success: true,
            data: {
                config
            },
            message: localDict.fa.success.firstConfig
        });
    } catch (err) {
        next(err)
    }
}


const createSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.role = 'super-admin';
        const config = await Config.findOne({}).sort({ createdAt: -1 });
        if (!config) {
            throw new Error(localDict.fa.errors.configNotFound);
        }   
        const admin = await services.admin.create(req.body);
        
        await loadConfig();
        res.status(200).json({
            success: true,
            data: {
                config,
                admin
            },
            message: localDict.fa.success.superAdminAdded
        });
    } catch (err) {
        next(err)
    }
}

export default {
    gettingStarted,
    createSuperAdmin
};