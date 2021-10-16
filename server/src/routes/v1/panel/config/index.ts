import { Router } from 'express';
import { errors } from 'celebrate';
import config from '../../../../controllers/v1';
import gettingStarted from '../../../../middlewares/gettingStarted';
import { validateConfig, validateAdmin } from '../../../../helpers/validators';
import authMiddleware from '../../../../middlewares/auth';
import upload from '../../../../middlewares/multer';
import resize from '../../../../middlewares/jimp';


export default () => {
    const app = Router();

    app.post('/getting-started',
        gettingStarted.isFirstTime,
        validateConfig,
        config.gettingStarted
    );

    app.post('/getting-started/create-super-admin',
        gettingStarted.isFirstTime,
        validateAdmin,
        config.createSuperAdmin
    );

    // update config
    app.put('/',
        gettingStarted.isNotFirstTime,
        authMiddleware.verify,
        authMiddleware.isSuperAdmin,
        validateConfig,
        config.update
    );

    // get config
    app.get('/',
        gettingStarted.isNotFirstTime,
        authMiddleware.verify,
        authMiddleware.isAdmin,
        validateConfig,
        config.get
    );

    app.put('/logo',
        gettingStarted.isNotFirstTime,
        authMiddleware.verify,
        authMiddleware.isSuperAdmin,
        upload.single('image'),
        resize.one,
        config.updateLogo
    );

    app.put('/favicon',
        gettingStarted.isNotFirstTime,
        authMiddleware.verify,
        authMiddleware.isSuperAdmin,
        upload.single('image'),
        resize.favicon,
        config.updateFavicon
    );


    // Adding celebrate error handling
    app.use(errors());

    return app;
};