import { Router } from 'express';
import { errors } from 'celebrate';
import config from '../../../../controllers/v1';
import { validateConfig, validateAdmin } from '../../../../helpers/validators';
import authMiddleware from '../../../../middlewares/auth';


export default () => {
    const app = Router();

    // admins list
    app.get('/',
        config.gettingStarted
    );

    app.post('/getting-started/create-super-admin',
        validateAdmin,
        config.createSuperAdmin
    );

    // update config
    app.put('/',
        authMiddleware.verify,
        authMiddleware.isSuperAdmin,
        validateConfig,
        config.update
    );

    // get config
    app.get('/',
        authMiddleware.verify,
        authMiddleware.isAdmin,
        validateConfig,
        config.get
    );


    // Adding celebrate error handling
    app.use(errors());

    return app;
};