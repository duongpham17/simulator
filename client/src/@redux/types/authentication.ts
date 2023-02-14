/*TYPES**************************************************************************************************************/
export interface ResponseType {
    [key: string]: string
};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE_AUTHENTICATION {
    isLoggedIn: boolean,
    status: ResponseType,
    errors: ResponseType,
};

/*ACTION**************************************************************************************************************/

export enum TYPES_AUTHENTICATION {
    AUTHENTICATION_LOAD_USER = "AUTHENTICATION_LOAD_USER",
    RESPONSE_ERROR = "RESPONSE_ERROR",
    RESPONSE_STATUS = "RESPONSE_STATUS",
    RESPONSE_CLEAR = "RESPONSE_CLEAR",
};

interface LoadUser {
    type: TYPES_AUTHENTICATION.AUTHENTICATION_LOAD_USER,
    payload: boolean
};

interface Response_Status {
    type: TYPES_AUTHENTICATION.RESPONSE_STATUS,
    payload: ResponseType
};

interface Response_Error {
    type: TYPES_AUTHENTICATION.RESPONSE_ERROR,
    payload: ResponseType
};

interface Response_Clear {
    type: TYPES_AUTHENTICATION.RESPONSE_CLEAR
    payload?: string
};

export type ACTION_AUTHENTICATION = LoadUser | Response_Status | Response_Clear | Response_Error
