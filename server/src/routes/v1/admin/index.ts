import {Router} from 'express';
import {errors} from 'celebrate';


export default () => {
    const app = Router();
    app.use('config', require('./config'));
    // Adding celebrate error handling
    app.use(errors());

    return app;
};