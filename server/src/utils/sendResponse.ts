import httpStatus from 'http-status';
import { Response } from 'express';
import { IService } from '../intefaces';
import config from '../config';

interface ISendResponseProps {
    res: Response;
    response: IService<object>;
    status?: number;
    token?: string;
}

const sendResponse = (props: ISendResponseProps) => {
    let {
        res,
        response,
        status = httpStatus.OK,
        token
    } = props;

    if (response?.result) {
        if (token) {
            // Set token in cookie
            res.cookie('token', token, {
                maxAge: 7 * 24 * 3600 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: true
            }).status(status).json(response);
        } else {
            // Send success response
            res.status(status).json({ result: response.result, pagination: response.pagination || undefined });
        }
    } else if (response?.errors) {
        // Send error response
        res.status(status).json({ errors: { message: response.errors } });
    } else {
        // Send unknown error response
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json(response);
    }
};

export default sendResponse;