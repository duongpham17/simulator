/*TYPES**************************************************************************************************************/

export interface IOrders {
    _id: string,
    market_id: string,
    simulator: string,
    clientOid: string,
    open: boolean,
    closed: "bot" | "manual",
    side: "buy" | "sell",
    open_price: number,
    close_price: number,
    moving_price: number,
    trailing_take_profit: boolean,
    stop_loss: number,
    take_profit: number,
    profit_loss: number,
    position_size: number,
    leverage: number,
    strategy: string,
    live: boolean,
    closed_at_date: Date,
    open_at_date: Date,
};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE_ORDERS {
    orders: IOrders[] | null,
};

/*ACTION**************************************************************************************************************/

export enum TYPES_ORDERS {
    ORDERS = "ORDERS",
};

interface Orders {
    type: TYPES_ORDERS.ORDERS,
    payload: IOrders[]
};

export type ACTION_ORDERS = Orders