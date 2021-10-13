import {Router} from 'express';
import {errors} from 'celebrate';


export default () => {
    const app = Router();
    app.use('admin', require('./admin'));
    // Adding celebrate error handling
    app.use(errors());

    return app;
};