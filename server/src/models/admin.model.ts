import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import { IAdmin } from '../intefaces';
import argon2 from 'argon2';
import localDict from '../helpers/dict';
import { adminRoleEnum } from '../helpers/enums';
import {randomBytes} from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config';

const adminSchema = new Schema<IAdmin>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 30,
            validate(value: string) {
                if (!validator.isAlpha(value)) {
                    throw new Error(localDict.fa.errors.nameValidationFailed);
                }
            }
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 30,
            validate(value: string) {
                if (!validator.isAlpha(value)) {
                    throw new Error(localDict.fa.errors.nameValidationFailed);
                }
            }
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
                if (!validator.matches(value, /^(\+98|0)?9\d{9}$/)) {
                    throw new Error(localDict.fa.errors.phoneValidationFailed);
                }
            }
        },
        password: {
            type: String,
            required: true,
            trim: true,
            private: true
        },
        salt: {
            type: String,
            private: true
        },
        digitCode: {
            type: String,
        },
        digitCodeExpire: {
            type: Date,
        },
        uuidCode: {
            type: String,
        },
        uuidCodeExpire: {
            type: Date,
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        phoneVerified: {
            type: Boolean,
            default: false
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            default: 'admin',
            enum: adminRoleEnum
        },
        image: {
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
    },
    {
        timestamps: true
    }
);

// to check email or phone number is exist or not
adminSchema.statics.isEmailOrPhoneTaken = async function (email, phone, excludeUserId) {
    let admin;
    if (excludeUserId) {
        admin = await this.findOne({ $or: [{email}, {phone}], _id: { $ne: excludeUserId } });
    } else {
        admin = await this.findOne({ $or: [{email}, {phone}] });
    }
    return !!admin;
};

// generate password hash and salt before save
adminSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const salt = randomBytes(32);
        user.password = await argon2.hash(user.password, {salt});
        user.salt = salt.toString('hex');
    }
    next();
});

// generate auth token
adminSchema.methods.generateAuthToken = function() { 
    const user = this;
    const token = jwt.sign({
        _id: user._id,
        role: user.role,
        full_name: (user.firstName + ' ' + user.lastName).trim(),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
    }, config.jwtSecret, {
        algorithm: 'RS256'
    });
    
    return token;
  }

/**
 * @typedef Admin
 */
const Admin = mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;