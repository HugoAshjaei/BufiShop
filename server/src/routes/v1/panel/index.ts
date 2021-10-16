import { Router } from 'express';
import { errors } from 'celebrate';
import config from './config';
import admin from './admin';
import gettingStarted from '../../../middlewares/gettingStarted';
import authMiddleware from '../../../middlewares/auth';

export default () => {
    const app = Router();
    app.use('/config', config());
    app.use('/admin', gettingStarted.isNotFirstTime, authMiddleware.verify, authMiddleware.isSuperAdmin, admin());
    // Adding celebrate error handling
    app.use(errors());

    return app;
};