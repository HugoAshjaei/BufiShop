import jimp from 'jimp';
import fs from 'fs';
import util from 'util';
import { Response, NextFunction } from 'express';
import { RequestCustom } from '../../intefaces';
import localDict from '../../helpers/dict';
import config from '../../config';

// promisify fs readFile
const readFile = util.promisify(fs.readFile);


const imageFormats = ['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi', 'png', 'gif', 'webp', 'tiff', 'tif', 'raw', 'bmp',
    'jp2', 'j2k', 'jpf', 'jpx', 'jpm', 'mj2', 'svg', 'svgz', 'ico'];


export async function one(req: RequestCustom, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            throw new Error(localDict.fa.errors.resizeProblem);
        }
        const file = req.file;
        const format = file.originalname.split('.')[file.originalname.split('.').length - 1];
        if (imageFormats.includes(format.toLowerCase())) {
            req.body.image = {
                original: file.path,
                thumbnail: await resize(file.path, config.imagesSize.thumbnail.width, config.imagesSize.thumbnail.height),
                small: await resize(file.path, config.imagesSize.small.width, config.imagesSize.small.height),
                medium: await resize(file.path, config.imagesSize.medium.width, config.imagesSize.medium.height),
                large: await resize(file.path, config.imagesSize.large.width, config.imagesSize.large.height)
            }
            await next();
        } else {
            await next();
        }
    } catch (error) {
        throw new Error(localDict.fa.errors.resizeProblem);
    }
}

export async function multiple(req: RequestCustom, res: Response, next: NextFunction) {
    try {
        if (!req.files) {
            throw new Error(localDict.fa.errors.resizeProblem);
        }
        if (!req.files.image) {
            throw new Error(localDict.fa.errors.resizeProblem);
        }
        const files = req.files.image;
        req.body.images = [];
        files.forEach(async (file: any) => {
            const format = file.originalname.split('.')[file.originalname.split('.').length - 1];
            if (imageFormats.includes(format.toLowerCase())) {
                req.body.images.push({
                    original: file.path,
                    thumbnail: await resize(file.path, config.imagesSize.thumbnail.width, config.imagesSize.thumbnail.height),
                    small: await resize(file.path, config.imagesSize.small.width, config.imagesSize.small.height),
                    medium: await resize(file.path, config.imagesSize.medium.width, config.imagesSize.medium.height),
                    large: await resize(file.path, config.imagesSize.large.width, config.imagesSize.large.height)
                });
            }
        }
        );
    } catch (error) {
        throw new Error(localDict.fa.errors.resizeProblem);
    }
}

export async function favicon(req: RequestCustom, res: Response, next: NextFunction) {
    try {
        if (!req.file) {
            throw new Error(localDict.fa.errors.resizeProblem);
        }
        const file = req.file;
        const format = file.originalname.split('.')[file.originalname.split('.').length - 1];
        if (imageFormats.includes(format.toLowerCase())) {
            req.body.favicon = await resize(file.path, 64, 64);
            await next();
        } else {
            await next();
        }
    } catch (error) {
        throw new Error(localDict.fa.errors.resizeProblem);
    }
}

async function resize(file: string, width: number, height: number) {
    const read = readFile(__dirname + '/../../' + file);
    const realPath = file.split('/').slice(0, -1).join('/');
    const fullname = file.split('/')[file.split('/').length - 1];
    const name = fullname.split('.');
    const write = __dirname + '/../../' + realPath + '/' + name.slice(0, -1) + `-size${width}x${height}.` + name[name.length - 1];
    await jimp.read(await read, (err, image) => {
        if (err) throw err;
        if (image.bitmap.height < image.bitmap.width) {
            const w = ((image.bitmap.width * width) / (image.bitmap.height * 2)) - (width / 2);
            image
                .resize(jimp.AUTO, width)
                .crop(w, 0, width, height)
                .quality(85)
                .write(write);
        } else {
            const h = ((image.bitmap.height * height) / (image.bitmap.width * 2)) - (height / 2);
            image
                .resize(width, jimp.AUTO)
                .crop(0, h, width, height)
                .quality(85)
                .write(write);
        }
    });
    return realPath + '/' + name.slice(0, -1) + `-size${width}x${height}.` + name[name.length - 1];
};