import { ACTION_TRADES, TYPES_TRADES, INITIALSTATE_TRADES} from '@redux/types/trades';

const initialState: INITIALSTATE_TRADES = {
    isTrading: false,
    inputs: null ,
    trades: null,
    trading: null,
    prices: null,
    orders: null,
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
            let orders = state.orders;
            if(payload.order && orders) {
                const index = orders.findIndex(el => el._id === payload.order._id);
                if(index === -1) orders = [...orders, payload.order];
                if(index !== -1) orders[index] = payload.order;
            }
            if(payload.order && !orders) orders = [payload.order];
            return{
                ...state,
                trading: payload.simulator,
                prices: state.prices ? [...state.prices.slice(-1800), ...payload.price] : [...payload.price.slice(-1800)],
                price_latest: payload.price[0].price,
                orders: orders
            };
        case TYPES_TRADES.TRADES_CLOSE:
            return{
                ...state,
                trading: payload.simulator,
                orders: state.orders ? state.orders.map(el => el._id === payload.order._id ? payload.order : el ) : state.orders
            }
        case TYPES_TRADES.TRADES_LOAD:
            return{
                ...state,
                trading: payload.simulator,
                orders: payload.orders,
                prices: payload.prices.prices
            };

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