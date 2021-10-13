
import { Request, Response, NextFunction } from 'express';
import { Config, Admin } from '../../../models';
import { loadConfig } from '../../../loaders/config.loader';
import localDict from '../../../helpers/dict';

const gettingStarted = async (req: Request, res: Response) => {
    try {
        const config = await new Config(req.body).save();
        res.status(200).json({
            success: true,
            data: {
                config
            },
            message: localDict.fa.success.firstConfig
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
}


const createSuperAdmin = async (req: Request, res: Response) => {
    try {
        req.body.role = 'super-admin';
        const config = await Config.findOne({}).sort({ createdAt: -1 });
        if (!config) {
            throw new Error(localDict.fa.errors.configNotFound);
        }   
        const admin = await new Admin(req.body).save();
        await loadConfig();
        res.status(200).json({
            success: true,
            data: {
                config,
                admin
            },
            message: localDict.fa.success.superAdminAdded
        });
    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
}

export default {
    gettingStarted,
    createSuperAdmin
};