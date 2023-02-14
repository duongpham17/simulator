import { api } from '@redux/api';
import { Dispatch } from 'redux';
import { IStrategiesCustomInputs } from '@redux/types/strategies';
import { ACTION_SIMULATORS, TYPES_SIMULATORS, SimulatorObjectKeys} from '@redux/types/simulators';

const simulators = () => async (dispatch: Dispatch<ACTION_SIMULATORS>) => {
    try{
        const res = await api.get(`/simulators`);
        dispatch({
            type: TYPES_SIMULATORS.SIMULATORS,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
    }
};

const simulator = (id: string) => async (dispatch: Dispatch<ACTION_SIMULATORS>) => {
    try{
        const res = await api.get(`/simulators/${id}`);
        dispatch({
            type: TYPES_SIMULATORS.SIMULATORS_SIMULATOR,
            payload: res.data.data
        });
    } catch(err: any){
        console.log(err.response)
    }
};

const simulator_remove = (id: string) => async (dispatch: Dispatch<ACTION_SIMULATORS>) => {
    try{
        await api.delete(`/simulators/${id}`);
        dispatch({
            type: TYPES_SIMULATORS.SIMULATORS_SIMULATOR_REMOVE,
            payload: id
        });
    } catch(err: any){
        console.log(err.response)
    }
};

const simulate = (strategy: Partial<IStrategiesCustomInputs>, simulatorId: string) => async (dispatch: Dispatch<ACTION_SIMULATORS>) => {
    try{
        const res = await api.post(`/simulators/simulate`, {strategy, simulatorId});
        dispatch({
            type: TYPES_SIMULATORS.SIMULATORS_SIMULATE,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log(error.response)
    }
};

const simulate_remove = (id: string) => async (dispatch: Dispatch<ACTION_SIMULATORS>) => {
    try{
        dispatch({
            type: TYPES_SIMULATORS.SIMULATORS_SIMULATE_REMOVE,
            payload: id
        });
    } catch (error: any) {
        console.log(error.response)
    }
};

const clear = (key: SimulatorObjectKeys, value: any) => async (dispatch: Dispatch<ACTION_SIMULATORS>) => {
    dispatch({
        type: TYPES_SIMULATORS.SIMULATORS_CLEAR,
        payload: {key, value}
    });
};

const Simulator = {
    simulators,
    simulator,
    simulator_remove,
    simulate,
    simulate_remove,
    clear,
};

export default Simulator;