import Joi from "joi";
import { Request, Response, NextFunction } from 'express';
import localDict from '../../helpers/dict';

const adminSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().optional(),
    password: Joi.string().required(),
    phone: Joi.string().optional().regex(/^(\+98|0)?9\d{9}$/)
}).xor('email', 'phone');

export default function validateAdmin(req: Request, res: Response, next: NextFunction) {
    const { error } = adminSchema.validate(req.body);
    if (error) {
        res.statusCode = 400;
        throw new Error(localDict.fa.errors.requiredDataCorrectly);
    }
    next();
}