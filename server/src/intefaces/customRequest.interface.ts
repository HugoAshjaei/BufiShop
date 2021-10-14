import {Request} from 'express';

export interface RequestCustom extends Request
{
    token?: string;
    user?: any;
}