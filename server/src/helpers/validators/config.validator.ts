import Joi from "joi";
import { Request, Response, NextFunction } from 'express';
import localDict from '../../helpers/dict';

const configSchema = Joi.object().keys({
    name: Joi.string().alphanum().required(),
    description: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional().regex(/[0-9]/),
    address: Joi.object().keys({
        province: Joi.string().required(),
        city: Joi.string().required(),
        zone: Joi.string().optional(),
        address: Joi.string().required(),
        postalCode: Joi.string().optional(),
        location: Joi.object().keys({
            lat: Joi.number().required(),
            lng: Joi.number().required()
        })
    }),
    terms: Joi.string().optional(),
    currencyCode: Joi.string().optional(),
    type: Joi.string().required(),
    isEmailVerificationRequired: Joi.boolean().required(),
    smtp: Joi.object().optional().keys({
        host: Joi.string().required(),
        port: Joi.number().required(),
        secure: Joi.boolean().required(),
        auth: Joi.object().keys({
            user: Joi.string().required(),
            pass: Joi.string().required()
        })
    }),
    isSmsVerificationRequired: Joi.boolean().optional()
});

export default function validateConfig(req: Request, res: Response, next: NextFunction) {
    const { error } = configSchema.validate(req.body);
    if (error) {
        throw new Error(localDict.fa.errors.requiredDataCorrectly);
    }
    next();
}