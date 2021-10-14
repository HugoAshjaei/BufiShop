import {Router} from 'express';
import {errors} from 'celebrate';
import config from './config';

export default () => {
    const app = Router();
    app.use('/config', config());
    // Adding celebrate error handling
    app.use(errors());

    return app;
};