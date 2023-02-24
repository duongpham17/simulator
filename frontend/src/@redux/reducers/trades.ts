import { ACTION_TRADES, TYPES_TRADES, INITIALSTATE_TRADES} from '@redux/types/trades';

const initialState: INITIALSTATE_TRADES = {
    isTrading: false,
    inputs: null ,
    trades: null,
    trading: null,
    prices: null,
    orders_closed: null,
    orders_open: null,
    price_latest: 0,
    price_snapshot: 0,
};

export const trades = (state = initialState, action: ACTION_TRADES) => {
    const {type, payload} = action;

    switch(type){
        case TYPES_TRADES.TRADES_START:
            return{
                ...state,
                isTrading: state.isTrading ? false : true,
                inputs: payload,
            };
        case TYPES_TRADES.TRADES:
            return{
                ...state,
                trades: payload
            };
        case TYPES_TRADES.TRADES_PRICE:
            return{
                ...state,
                price_snapshot: payload
            };
        case TYPES_TRADES.TRADES_TRADING:
            let closed = state.orders_closed;
            let opened = state.orders_open;

            if(payload.order) {
                if(payload.order.open === true) {
                    opened = [...state.orders_open || [], payload.order]
                    closed = state.orders_closed;
                }
                if(payload.order.open === false) {
                    closed = [...state.orders_closed || [], payload.order]
                    opened = state.orders_open ? state.orders_open.filter(el => el._id !== payload.order._id) : []
                }
            };
    
            return{
                ...state,
                trading: payload.simulator,
                prices: state.prices ? [...state.prices.slice(-2000), payload.price] : [payload.price],
                price_latest: payload.price.price,
                orders_closed: closed,
                orders_open: opened,
            };
        case TYPES_TRADES.TRADES_LOAD:
            return{
                ...state,
                trading: payload.simulator,
                prices: payload.prices,
                orders_open: payload.trades,
                orders_closed: payload.orders,
            };
        case TYPES_TRADES.TRADES_CLOSE:
            return{
                ...state,
                trading: payload.simulator,
                orders_open: state.orders_open ? state.orders_open.filter(el => el._id !== payload.order._id) : state.orders_open,
                orders_closed: state.orders_closed ? [payload.order, ...state.orders_closed] : state.orders_closed
            }
        case TYPES_TRADES.TRADES_STATE_CLEAR:
            return{
                ...state,
                [payload.key]: payload.value
            }
        case TYPES_TRADES.TRADES_STATE_RESET:
            return{
                ...initialState,
            }
        default: 
            return state;
    }
}

export default trades;