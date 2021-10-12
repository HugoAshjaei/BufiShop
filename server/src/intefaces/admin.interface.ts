import { IImages } from ".";

export interface IAdmin {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    password?: string;
    salt?: string;
    phone?: string;
    digitCode?: string;
    digitCodeExpire?: Date;
    uuidCode?: string;
    uuidCodeExpire?: Date;
    emailVerified: boolean;
    phoneVerified: boolean;
    isBlocked: boolean;
    role: 'admin' | 'super-admin';
    image: IImages;
}