import {Router} from 'express';
import {errors} from 'celebrate';
import admin from './admin';

export default () => {
    const app = Router();
    app.use('/admin', admin());
    // Adding celebrate error handling
    app.use(errors());

    return app;
};