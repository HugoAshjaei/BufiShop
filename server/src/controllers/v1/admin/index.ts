
import { Response, NextFunction } from 'express';
import { RequestCustom } from '../../../intefaces';
import { loadConfig } from '../../../loaders/config.loader';
import * as services from '../../../services';
import sendResponse from '../../../utils/sendResponse';

const create = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
        const admin = await services.admin.create(req.body);
        await loadConfig();
        return sendResponse({ res, status: 200, response: { result: { admin } } });
    } catch (err) {
        next(err)
    }
}

const list = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
        const data = await services.admin.list(String(req.query.search || ''), {
            page: Number(req.query.page || 1), limit: Number(req.query.limit || 10)
        });
        return sendResponse({ res, status: 200, response: { result: data } });
    } catch (err) {
        next(err)
    }
}

const getById = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
        const data = await services.admin.one(req.params.id);
        return sendResponse({ res, status: 200, response: { result: data } });
    } catch (err) {
        next(err)
    }
}

const updateById = async (req: RequestCustom, res: Response, next: NextFunction) => {
    try {
        const data = await services.admin.update(req.params.id, req.body);
        return sendResponse({ res, status: 200, response: { result: data } });
    } catch (err) {
        next(err)
    }
}


export default {
    list,
    getById,
    create,
    updateById
};