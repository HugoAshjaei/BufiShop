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

    app.put('/:id/block',
        admin.blockById
    );

    app.put('/:id/unblock',
        admin.unblockById
    );

    app.delete('/',
        admin.deleteByIds
    );

    // Adding celebrate error handling
    app.use(errors());

    return app;
};