import {Router} from 'express';
import {errors} from 'celebrate';
import panel from './panel';

export default () => {
    const app = Router();
    app.use('/panel', panel());
    // Adding celebrate error handling
    app.use(errors());

    return app;
};