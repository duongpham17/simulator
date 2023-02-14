import { Request } from 'express';
import { IUser } from '../model/users'

export interface InjectUserToRequest extends Request {
    user: IUser // or any other type
}