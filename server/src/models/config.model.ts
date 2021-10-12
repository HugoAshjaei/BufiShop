import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { IConfig } from '../intefaces';
import localDict from '../helpers/dict';
import { currencyCodeEnum, storeTypes } from '../helpers/enums';

const configSchema = new Schema<IConfig>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value: string) {
                if (!validator.isEmail(value)) {
                    throw new Error(localDict.fa.errors.emailValidationFailed);
                }
            }
        },
        phone: {
            type: String,
            trim: true,
            validate(value: string) {
                if (!validator.matches(value, /^(\+98?)?{?(0?[0-9]{10,10}}?)$/gm)) {
                    throw new Error(localDict.fa.errors.phoneValidationFailed);
                }
            }
        },
        address: {
            province: {
                type: String,
                required: true,
                trim: true
            },
            city: {
                type: String,
                required: true,
                trim: true
            },
            zone: {
                type: String,
                trim: true
            },
            address: {
                type: String,
                required: true,
                trim: true
            },
            postalCode: {
                type: String,
                required: true,
                trim: true
            },
            location: {
                lat: {
                    type: Number
                },
                lng: {
                    type: Number
                }
            }
        },
        currencyCode: {
            type: String,
            default: 'ریال',
            enum: currencyCodeEnum
        },
        type: {
            type: String,
            required: true,
            enum: storeTypes,
            default: 'product'
        },
        logo: {
            original: {
                type: String,
                default: 'uploads/default/original.jpg'
            },
            thumbnail: {
                type: String,
                default: 'uploads/default/thumbnail.jpg'
            },
            small: {
                type: String,
                default: 'uploads/default/small.jpg'
            },
            medium: {
                type: String,
                default: 'uploads/default/medium.jpg'
            },
            large: {
                type: String,
                default: 'uploads/default/large.jpg'
            }
        },
        favicon: {
            type: String,
            default: 'uploads/default/favicon.png'
        }
    },
    {
        timestamps: true
    }
);

/**
 * @typedef Config
 */
const Config = mongoose.model<IConfig>('Config', configSchema);

export default Config;