import { api } from '@redux/api';
import { Dispatch } from 'redux';
import { IStrategies, IStrategiesInputsTrades } from '@redux/types/strategies';
import { ACTION_TRADES, TYPES_TRADES, IOrders, TradesObjectKeys} from '@redux/types/trades';
import {ISimulator} from '@redux/types/simulators';

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

const live = (strategy: IStrategies, simulator: ISimulator | null, order: IOrders | null) => async (dispatch: Dispatch<ACTION_TRADES>) => {
    try{
        const res = await api.post(`/trades/live`, {strategy, simulator, order});
        dispatch({
            type: TYPES_TRADES.TRADES_TRADING,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log(error.response)
    }
};

const test = (strategy: IStrategies, simulator: ISimulator | null, order: IOrders | null) => async (dispatch: Dispatch<ACTION_TRADES>) => {
    try{
        const res = await api.post(`/trades/test`, {strategy, simulator, order});
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
        console.log("Please reload")
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

const clear = (key:TradesObjectKeys, value: any) => async (dispatch: Dispatch<ACTION_TRADES>) => {
    dispatch({
        type: TYPES_TRADES.TRADES_STATE_CLEAR,
        payload: { key, value }
    });
};

const Trades = {
    start,
    trades,
    live,
    test,
    close,
    price,
    load,
    clear,
};

export default Trades;