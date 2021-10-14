import Joi from "joi";
import { Request, Response, NextFunction } from 'express';
import localDict from '../../helpers/dict';

const configSchema = Joi.object().keys({
    name: Joi.string().alphanum().required().min(1),
    description: Joi.string().required().min(5),
    email: Joi.string().email().required(),
    phone: Joi.string().optional().regex(/[0-9]/),
    address: Joi.object().keys({
        province: Joi.string().required().min(2),
        city: Joi.string().required().min(2),
        zone: Joi.string().optional(),
        address: Joi.string().required().min(5),
        postalCode: Joi.string().optional(),
        location: Joi.object().optional().keys({
            lat: Joi.number().required(),
            lng: Joi.number().required()
        })
    }),
    terms: Joi.string().optional(),
    currencyCode: Joi.string().optional(),
    type: Joi.string().optional(),
    isEmailVerificationRequired: Joi.boolean().required(),
    smtp: Joi.object().optional().keys({
        host: Joi.string().required(),
        port: Joi.number().required(),
        secure: Joi.boolean().required(),
        auth: Joi.object().keys({
            user: Joi.string().required(),
            pass: Joi.string().required()
        })
    })
});

export default function validateConfig(req: Request, res: Response, next: NextFunction) {
    const { error } = configSchema.validate(req.body);
    if (error) {
        res.statusCode = 400;
        throw new Error(localDict.fa.errors.requiredDataCorrectly);
    }
    next();
}