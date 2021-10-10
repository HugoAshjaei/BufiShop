import {Router} from 'express';
import {errors} from 'celebrate';


export default () => {
    const app = Router();


    // Adding celebrate error handling
    app.use(errors());

    return app;
};