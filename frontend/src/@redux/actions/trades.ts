import { api } from '@redux/api';
import { Dispatch } from 'redux';
import { IStrategies, IStrategiesInputsTrades } from '@redux/types/strategies';
import { IOrders } from '@redux/types/orders';
import { ACTION_TRADES, TYPES_TRADES, TradesObjectKeys} from '@redux/types/trades';
import { ISimulator } from '@redux/types/simulators';

const start = (inputs: IStrategiesInputsTrades) => async (dispatch: Dispatch<ACTION_TRADES>) => {
    dispatch({
        type: TYPES_TRADES.TRADES_START,
        payload: inputs,
    })
};

const price = (strategies: IStrategies ) => async (dispatch: Dispatch<ACTION_TRADES>) => {
    try{
        const res = await api.post(`/trades/price`, strategies);
        dispatch({
            type: TYPES_TRADES.TRADES_PRICE,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
    }
};

const trades = (id: string) => async (dispatch: Dispatch<ACTION_TRADES>) => {
    try{
        const res = await api.get(`/trades/${id}`);
        dispatch({
            type: TYPES_TRADES.TRADES,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log(error.response)
    }
};

const trade = (strategy: IStrategies, simulator: ISimulator | null, order: IOrders | null, price_previous: number) => async (dispatch: Dispatch<ACTION_TRADES>) => {
    try{
        const res = await api.post(`/trades/trade`, {strategy, simulator, order, price_previous});
        dispatch({
            type: TYPES_TRADES.TRADES_TRADING,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log(error.response)
    }
};

const close = (strategies:IStrategies, simulator: ISimulator, order: IOrders) => async (dispatch: Dispatch<ACTION_TRADES>) => {
    try{
        const res = await api.post(`/trades/close`, {strategies, simulator, order});
        dispatch({
            type: TYPES_TRADES.TRADES_CLOSE,
            payload:res.data.data
        })
    } catch (error: any) {
        console.log(error.response.data)
    }
};

const load = (id: string) => async (dispatch: Dispatch<ACTION_TRADES>) => {
    try{
        const res = await api.get(`/trades/load/${id}`);
        dispatch({
            type: TYPES_TRADES.TRADES_LOAD,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log(error.response)
    }
};

const reset = () => async (dispatch: Dispatch<ACTION_TRADES>) => {
    dispatch({
        type: TYPES_TRADES.TRADES_STATE_RESET,
        payload: null
    });
}

const clear = (key:TradesObjectKeys, value: any) => async (dispatch: Dispatch<ACTION_TRADES>) => {
    dispatch({
        type: TYPES_TRADES.TRADES_STATE_CLEAR,
        payload: { key, value }
    });
};


const Trades = {
    start,
    trades,
    trade,
    close,
    price,
    load,
    clear,
    reset
};

export default Trades;