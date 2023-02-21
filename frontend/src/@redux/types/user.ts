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

export type UserObjectKeys = keyof INITIALSTATE_USER

/*ACTION**************************************************************************************************************/

export enum TYPES_USER {
    USER = "USER",

    USER_RESPONSE_STATUS = "RESPONSE_STATUS",
    USER_RESPONSE_ERROR  = "RESPONSE_ERROR",
    USER_RESPONSE_CLEAR  = "RESPONSE_CLEAR",
    USER_STATE_CLEAR     = "USER_STATE_CLEAR",
};

interface User {
    type: TYPES_USER.USER,
    payload: IUser
};

interface Response_Status {
    type: TYPES_USER.USER_RESPONSE_STATUS,
    payload: ResponseType
};

interface Response_Error {
    type: TYPES_USER.USER_RESPONSE_ERROR,
    payload: ResponseType
};

interface Response_Clear {
    type: TYPES_USER.USER_RESPONSE_CLEAR
    payload?: string
};

interface State_Clear {
    type: TYPES_USER.USER_STATE_CLEAR,
    payload: {
        key: UserObjectKeys,
        value: any
    }
};

export type ACTION_USER = User | Response_Error | Response_Status | Response_Clear | State_Clear