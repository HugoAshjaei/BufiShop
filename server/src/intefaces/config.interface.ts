import { ILocation } from ".";
import { IImages } from ".";

export interface IConfig {
    _id: string;
    name: string;
    description?: string;
    email: string;
    phone?: string;
    address: IConfigAddress;
    terms?: string;
    currencyCode: 'ریال' | 'تومان',
    logo?: IImages;
    favicon?: String;
    type: 'product' | 'service' | 'file';
}

export interface IConfigAddress {
    province: string;
    city: string;
    zone?: string;
    address: string;
    postalCode?: string;
    location?: ILocation;
}