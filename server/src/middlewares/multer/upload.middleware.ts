import { optional } from 'joi';
import multer from 'multer';
import options from './options';


const upload = multer({
    storage: options
});

export default upload;