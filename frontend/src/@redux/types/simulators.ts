/*TYPES**************************************************************************************************************/

import { IOrders } from './orders';
import { IStrategies } from './strategies';

export interface ISimulator {
    id?: string,
    _id: string,
    user: string,
    strategies: string,
    prices: string,
    prices_count: number,
    market_id: string,
    price_snapshot: number,
    price_open_snapshot: number,
    used: boolean,
    reset: number,
    live: boolean,
    createdAt: Date,
};

export interface ISimulatorOrders extends ISimulator{
    orders: IOrders[]
};

export interface ISimulatorSimulated {
    simulator: ISimulator,
    strategy: IStrategies,
    orders: IOrders[]
}

/*STATE**************************************************************************************************************/

export interface INITIALSTATE_SIMULATOR {
    simulators: ISimulator[] | null,
    simulator: ISimulatorOrders | null,
    simulated: ISimulatorSimulated[]| null,
};

export type SimulatorObjectKeys = keyof INITIALSTATE_SIMULATOR

/*ACTION**************************************************************************************************************/

export enum TYPES_SIMULATORS {
    SIMULATORS = "SIMULATORS",
    SIMULATORS_SIMULATOR = "SIMULATORS_SIMULATOR",
    SIMULATORS_SIMULATOR_REMOVE = "SIMULATORS_SIMULATOR_REMOVE",
    SIMULATORS_SIMULATED = "SIMULATORS_SIMULATED",
    SIMULATORS_SIMULATE_REMOVE = "SIMULATORS_SIMULATE_REMOVE",
    SIMULATORS_STATE_CLEAR = "SIMULATORS_STATE_CLEAR"
};

interface Simulators {
    type: TYPES_SIMULATORS.SIMULATORS,
    payload: ISimulator[]
};

interface Simulator {
    type: TYPES_SIMULATORS.SIMULATORS_SIMULATOR,
    payload: {
        simulator: ISimulator,
        orders: IOrders[]
    }
};

interface Simulator_remove {
    type: TYPES_SIMULATORS.SIMULATORS_SIMULATOR_REMOVE,
    payload: string
}

interface Simulated {
    type: TYPES_SIMULATORS.SIMULATORS_SIMULATED,
    payload: ISimulatorSimulated
};

interface Simulate_Remove {
    type: TYPES_SIMULATORS.SIMULATORS_SIMULATE_REMOVE,
    payload: string
}

interface Clear {
    type: TYPES_SIMULATORS.SIMULATORS_STATE_CLEAR,
    payload: {
        key: SimulatorObjectKeys,
        value: any
    }
};

export type ACTION_SIMULATORS = Simulators | Simulator | Simulator_remove | Simulated | Simulate_Remove | Clear