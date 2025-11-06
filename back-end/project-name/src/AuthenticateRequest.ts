import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    cookies: {
        userId?: number;
    };
}
