import { Dispatch } from 'redux';
import { api } from '@redux/api';
import { ACTION_STRATEGIES, TYPES_STRATEGIES, IStrategies, StrategiesObjectKeys } from '@redux/types/strategies';

const get = () => async (dispatch: Dispatch<ACTION_STRATEGIES>) => {
    try{
        const res = await api.get('/strategies');
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES,
            payload: res.data.data
        });
    } catch(err: any){
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_RESPONSE_ERROR,
            payload: {
                get: err.response.data.message
            }
        })
    }
};

const select = (id: string) => async (dispatch: Dispatch<ACTION_STRATEGIES>) => {
    try{
        const res = await api.get(`/strategies/${id}`);
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_STRATEGY,
            payload: res.data.data
        });
    } catch(err: any){
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_RESPONSE_ERROR,
            payload: {
                select: "Please refresh"
            }
        })
    }
}

const build = (data: Partial<IStrategies>) => async (dispatch: Dispatch<ACTION_STRATEGIES>) => {
    try{
        const res = await api.post('/strategies', data);
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_BUILD,
            payload: res.data.data
        });
    } catch(err: any){
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_RESPONSE_ERROR,
            payload: {
                build: err.response.data.message
            }
        })
    }
};

const checkapi = ({api_key, secret_key, passphrase}: {api_key: string, secret_key: string, passphrase: string}) => async (dispatch: Dispatch<ACTION_STRATEGIES>) => {
    try{
        const res = await api.post(`/strategies/check`, {api_key, secret_key, passphrase});
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_RESPONSE_STATUS,
            payload: {
                check_api: res.data.data
            }
        });
    } catch(err: any){
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_RESPONSE_STATUS,
            payload: {
                check_api: false
            }
        })
    }
};

const update = (data: Partial<IStrategies>) => async (dispatch: Dispatch<ACTION_STRATEGIES>) => {
    try{
        const res = await api.patch('/strategies', data);
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_UPDATE,
            payload: res.data.data
        });
    } catch(err: any){
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_RESPONSE_ERROR,
            payload: {
                update: err.response.data.message
            }
        })
    }
};

const duplicate = (data: IStrategies) => async (dispatch: Dispatch<ACTION_STRATEGIES>) => {
    try{
        const res = await api.post(`/strategies/duplicate`, data);
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_DUPLICATE,
            payload: { ...res.data.data, new: true}
        });
    } catch(err: any){
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_RESPONSE_ERROR,
            payload: {
                duplicate: err.response.data.message
            }
        })
    }
};

const remove = (id: string) => async (dispatch: Dispatch<ACTION_STRATEGIES>) => {
    try{
        await api.delete(`/strategies/${id}`);
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_REMOVE,
            payload: id
        });
    } catch(err: any){
        dispatch({
            type: TYPES_STRATEGIES.STRATEGIES_RESPONSE_ERROR,
            payload: {
                remove: err.response.data.message
            }
        })
    }
};

const state_clear = (key:StrategiesObjectKeys, value: any) => async (dispatch: Dispatch<ACTION_STRATEGIES>) => {
    dispatch({
        type: TYPES_STRATEGIES.STRATEGIES_STATE_CLEAR,
        payload: { key, value }
    });
};

const Strategies = {
    get,
    build,
    checkapi,
    remove,
    duplicate,
    update,
    select,
    state_clear
};

export default Strategies

