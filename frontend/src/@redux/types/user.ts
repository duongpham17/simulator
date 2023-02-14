/*TYPES**************************************************************************************************************/

export interface IUser {
    _id: string,
    email: string,
    role: "user" | "admin",
    createdAt: Date
};

/*STATE**************************************************************************************************************/

export interface ResponseType {
    [key: string]: string
};

export interface INITIALSTATE_USER {
    user: IUser | null,
    status: ResponseType,
    errors: ResponseType,
};

/*ACTION**************************************************************************************************************/

export enum TYPES_USER {
    USER = "USER",
    RESPONSE_STATUS = "RESPONSE_STATUS",
    RESPONSE_ERROR = "RESPONSE_ERROR",
    RESPONSE_CLEAR = "RESPONSE_CLEAR"
};

interface User {
    type: TYPES_USER.USER,
    payload: IUser
};

interface Status {
    type: TYPES_USER.RESPONSE_STATUS,
    payload: ResponseType
};

interface Errors {
    type: TYPES_USER.RESPONSE_ERROR,
    payload: ResponseType
};

interface Clear {
    type: TYPES_USER.RESPONSE_CLEAR
    payload?: string
};

export type ACTION_USER = User | Errors | Status | Clear