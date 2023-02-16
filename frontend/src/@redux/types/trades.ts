/*TYPES**************************************************************************************************************/
import { ISimulator, ISimulatorPopulate } from './simulators';
import { IStrategiesInputsTrades } from './strategies';
import { IOrders } from './orders';

export interface Price {
    _id: string,
    price: number,
    createdAt: Date,
};

export interface IPrices {
    _id: string,
    simulator: string,
    prices: Price[],
    createdAt: Date,
};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE_TRADES{
    isTrading: boolean,
    inputs: IStrategiesInputsTrades | null,
    trades: ISimulator[] | null,
    trading: ISimulator | null,
    orders: IOrders[] | null,
    prices: Price[] | null,
    price_snapshot: number,
    price_latest: number,
};

export type TradesObjectKeys = keyof INITIALSTATE_TRADES

/*ACTION**************************************************************************************************************/

export enum TYPES_TRADES {
    TRADES_START = "TRADES_START",
    TRADES = "TRADES",
    TRADES_TRADING = "TRADES_TRADING",
    TRADES_PRICE = "TRADES_PRICE",
    TRADES_REMOVE = "TRADES_REMOVE",
    TRADES_CLOSE = "TRADES_CLOSE",
    TRADES_LOAD = "TRADES_LOAD",
    TRADES_STATE_CLEAR = "TRADES_STATE_CLEAR",
};

interface Start {
    type: TYPES_TRADES.TRADES_START,
    payload: IStrategiesInputsTrades
}

interface Trades {
    type: TYPES_TRADES.TRADES,
    payload: ISimulator[]
};

interface Trade {
    type: TYPES_TRADES.TRADES_TRADING,
    payload: {
        simulator: ISimulator,
        order: IOrders,
        price: Price[]
    }
};

interface Close {
    type: TYPES_TRADES.TRADES_CLOSE,
    payload: {
        simulator: ISimulator,
        order: IOrders,
    }
};

interface Price_snapshot {
    type: TYPES_TRADES.TRADES_PRICE,
    payload: number
};

interface Load {
    type: TYPES_TRADES.TRADES_LOAD,
    payload: ISimulatorPopulate
};

interface Remove {
    type: TYPES_TRADES.TRADES_REMOVE,
    payload: string
};

interface Clear {
    type: TYPES_TRADES.TRADES_STATE_CLEAR,
    payload: {
        key: TradesObjectKeys,
        value: any
    }
};

export type ACTION_TRADES = Start | Trades | Trade | Load | Remove | Close | Price_snapshot | Clear
