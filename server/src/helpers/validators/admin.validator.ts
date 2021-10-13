import Joi from "joi";
import { Request, Response, NextFunction } from 'express';

const adminSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().optional(),
    password: Joi.string().required(),
    phone: Joi.string().optional().regex(/^(\+98?)?{?(0?[0-9]{10,10}}?)$/gm)
}).xor('email', 'phone');

export default function validateAdmin(req: Request, res: Response, next: NextFunction) {
    const { error } = adminSchema.validate(req.body);
    if (error) {
        throw new Error(JSON.stringify(error));
    }
    next();
}