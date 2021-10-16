import multer from 'multer';
import fs from 'fs';

const imageFormats = ['jpg', 'jpeg', 'jpe' , 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'tiff', 'tif', 'raw', 'bmp',
    'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz', 'ico'];
const documentFormats = ['doc', 'docx', 'html', 'htm', 'pdf', 'odt', 'xls', 'xlsx', 'ods', 'ppt', 'pptx', 'txt'];
const audioFormats = ['aa', 'aac', 'aax', 'aiaf', 'alac', 'amr', 'au', 'awb', 'cda', 'flac', 'm4a', 'm4b', 'mp3', 'mpc', 'ogg', 'oga', 'mogg',
    'voc', 'wav', 'wma'];
const videoFormats = ['webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'flv', 'swf', 'mkv', '3gp'];

export default multer.diskStorage({
    destination: (req, file, cb) => {
        const originalNameSplited = file.originalname.split('.');
        const format = (originalNameSplited[originalNameSplited.length - 1]).toLowerCase();
        let type = '';
        if (imageFormats.includes(format)){
            type = 'image';
        } else if (videoFormats.includes(format)){
            type = 'video';
        } else if (audioFormats.includes(format)){
            type = 'audio';
        } else if (documentFormats.includes(format)){
            type = 'document';
        } else {
            type = 'unknown';
        }
        const path = `uploads/${req.originalUrl.split('/')[2].toLowerCase()}/${type}`;
        fs.mkdir(path, {recursive: true}, (err) => {
            if (err)
                console.log(err);
            cb(null, path);
        });
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    },
});;