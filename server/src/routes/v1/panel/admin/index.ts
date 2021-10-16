import { Router } from 'express';
import { errors } from 'celebrate';
import { admin } from '../../../../controllers/v1';
import { validateAdmin } from '../../../../helpers/validators';


export default () => {
    const app = Router();

    // admins list
    app.get('/',
        admin.list
    );

    app.post('/add',
        validateAdmin,
        admin.create
    );

    app.get('/:id',
        admin.getById
    );

    app.put('/:id',
        admin.updateById
    );

    // Adding celebrate error handling
    app.use(errors());

    return app;
};