import { Router } from 'express';
import { errors } from 'celebrate';
import config from 'src/controllers/v1';
import isFirstTime from '../../../../middlewares/gettingStarted';
import { validateConfig, validateAdmin } from '../../../../helpers/validators';


export default () => {
    const app = Router();

    app.post('getting-started',
        isFirstTime,
        validateConfig,
        config.gettingStarted
    );

    app.post('getting-started/create-super-admin',
        isFirstTime,
        validateAdmin,
        config.createSuperAdmin
    );
    // Adding celebrate error handling
    app.use(errors());

    return app;
};