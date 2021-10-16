import { ILocation } from ".";
import { IImages } from ".";

export interface IConfig {
    _id: string;
    url: string;
    name: string;
    description?: string;
    email: string;
    phone?: string;
    address: IConfigAddress;
    terms?: string;
    currencyCode: 'ریال' | 'تومان',
    logo?: IImages;
    favicon?: string;
    type: 'product' | 'service' | 'file';
    isEmailVerificationRequired: boolean;
    smtp?: {
        from: string;
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        }
    };
}

export interface IConfigAddress {
    province: string;
    city: string;
    zone?: string;
    address: string;
    postalCode?: string;
    location?: ILocation;
}