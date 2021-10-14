import {Router} from 'express';
import {errors} from 'celebrate';
import v1 from './v1';


export default () => {
    const app = Router();
    app.use('/v1', v1());
    // Adding celebrate error handling
    app.use(errors());

    return app;
};