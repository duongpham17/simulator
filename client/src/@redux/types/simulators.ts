/*TYPES**************************************************************************************************************/

import {IStrategies} from './strategies';
import {IOrders, IPrices} from './trades';

export interface ISimulator {
    id?: string,
    _id: string,
    user: string,
    strategies: string,
    orders: string[],
    prices: string,
    market_id: string,
    price_snapshot: number,
    price_open_snapshot: number,
    reset: number,
    createdAt: Date,
};

export interface ISimulatorPopulate extends Omit<ISimulator, "strategies"|"prices"|"orders">{
    strategies: IStrategies,
    prices: IPrices,
    orders: IOrders[],
};

export interface ISimulatorPopulateOrders extends Omit<ISimulator, "orders">{
    orders: IOrders[],
};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE_SIMULATOR {
    simulators: ISimulator[] | null,
    simulator: ISimulatorPopulateOrders | null,
    simulated: ISimulatorPopulate[]| null,
};

export type SimulatorObjectKeys = keyof INITIALSTATE_SIMULATOR

/*ACTION**************************************************************************************************************/

export enum TYPES_SIMULATORS {
    SIMULATORS = "SIMULATORS",
    SIMULATORS_SIMULATOR = "SIMULATORS_SIMULATOR",
    SIMULATORS_SIMULATOR_REMOVE = "SIMULATORS_SIMULATOR_REMOVE",
    SIMULATORS_SIMULATE = "SIMULATORS_SIMULATE",
    SIMULATORS_SIMULATE_REMOVE = "SIMULATORS_SIMULATE_REMOVE",
    SIMULATORS_CLEAR = "SIMULATORS_CLEAR"
};

interface Simulators {
    type: TYPES_SIMULATORS.SIMULATORS,
    payload: ISimulator[]
};

interface Simulator {
    type: TYPES_SIMULATORS.SIMULATORS_SIMULATOR,
    payload: ISimulatorPopulateOrders
};

interface Simulator_remove {
    type: TYPES_SIMULATORS.SIMULATORS_SIMULATOR_REMOVE,
    payload: string
}

interface Simulate {
    type: TYPES_SIMULATORS.SIMULATORS_SIMULATE,
    payload: ISimulatorPopulate
};

interface Simulate_Remove {
    type: TYPES_SIMULATORS.SIMULATORS_SIMULATE_REMOVE,
    payload: string
}

interface Clear {
    type: TYPES_SIMULATORS.SIMULATORS_CLEAR,
    payload: {
        key: SimulatorObjectKeys,
        value: any
    }
};

export type ACTION_SIMULATORS = Simulators | Simulator | Simulator_remove | Simulate | Simulate_Remove | Clear