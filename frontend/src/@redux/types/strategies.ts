/*TYPES**************************************************************************************************************/
export interface IStrategiesInputsSimulate {
    strategy: string,
    short: number,
    long: number,
    trailing_take_profit: boolean,
    stop_loss: number,
    take_profit: number,
    position_size: number,
    leverage: number,
    reset: number
};

export interface IStrategies {
    _id: string,
    user: string,
    market_id: string,
    exchange: string,
    name: string,
    strategy: string,
    short: number,
    long: number,
    stop_loss: number,
    trailing_take_profit: boolean,
    take_profit: number,
    api_key: string,
    secret_key: string,
    passphrase: string,
    favourite: boolean,
    reset: number,
    usdt_balance: number,
    position_size: number,
    leverage: number,
    live: boolean,
    createdAt: Date,
};

export interface IStrategiesCustomInputs extends IStrategies {
    [key: string] : any,
}

export interface Response {
    [key: string]: any
};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE_STRATEGIES {
    strategies: IStrategiesCustomInputs[] | null,
    strategy: IStrategies | null,
    status: Response,
    errors: Response,
};

export type StrategiesObjectKeys = keyof INITIALSTATE_STRATEGIES

/*ACTION**************************************************************************************************************/

export enum TYPES_STRATEGIES {
    STRATEGIES             = "STRATEGIES",
    STRATEGIES_BUILD       = "STRATEGIES_BUILD",
    STRATEGIES_REMOVE      = "STRATEGIES_REMOVE",
    STRATEGIES_DUPLICATE   = "STRATEGIES_DUPLICATE",
    STRATEGIES_UPDATE      = "STRATEGIES_UPDATE",
    STRATEGIES_STRATEGY    = "STRATEGIES_STRATEGY",

    STRATEGIES_STATE_CLEAR = "STRATEGIES_STATE_CLEAR",
    STRATEGIES_RESPONSE_STATUS = "STRATEGIES_RESPONSE_STATUS",
    STRATEGIES_RESPONSE_ERROR  = "STRATEGIES_RESPONSE_ERROR",
    STRATEGIES_RESPONSE_CLEAR  = "STRATEGIES_RESPONSE_CLEAR",
};

interface Strategies {
    type: TYPES_STRATEGIES.STRATEGIES,
    payload: IStrategies[]
}

interface Build {
    type: TYPES_STRATEGIES.STRATEGIES_BUILD,
    payload: IStrategies
};

interface Update {
    type: TYPES_STRATEGIES.STRATEGIES_UPDATE,
    payload: IStrategies
}

interface Duplicate {
    type: TYPES_STRATEGIES.STRATEGIES_DUPLICATE,
    payload: IStrategiesCustomInputs
};

interface Remove {
    type: TYPES_STRATEGIES.STRATEGIES_REMOVE,
    payload: string
};

interface Strategy {
    type: TYPES_STRATEGIES.STRATEGIES_STRATEGY,
    payload: IStrategies
};

interface Response_Status {
    type: TYPES_STRATEGIES.STRATEGIES_RESPONSE_STATUS,
    payload: Response
};

interface Response_Error {
    type: TYPES_STRATEGIES.STRATEGIES_RESPONSE_ERROR,
    payload: Response
};

interface Response_Clear {
    type: TYPES_STRATEGIES.STRATEGIES_RESPONSE_CLEAR
    payload?: string
};

interface State_Clear {
    type: TYPES_STRATEGIES.STRATEGIES_STATE_CLEAR,
    payload: {
        key: StrategiesObjectKeys,
        value: any
    }
}

export type ACTION_STRATEGIES = 
    Strategies | Build | Remove | Duplicate | Update | Strategy |
    Response_Status | Response_Clear | Response_Error | State_Clear
