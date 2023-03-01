import {Types, Schema, model, PopulatedDoc, Document} from 'mongoose';
import {IStrategies} from './strategies';
import {IUsers} from './users';

export interface ISimulateInputs {
    strategy: string,
    short: number,
    long: number,
    stop_loss: number,
    trailing_take_profit: boolean,
    take_profit: number,
    position_size: number,
    leverage: number,
    reset: number,
};

export interface ISimulators extends Partial<Document> {
    user: PopulatedDoc<Types.ObjectId & IUsers>,
    strategies: PopulatedDoc<Types.ObjectId & IStrategies>,
    prices_count: number,
    used: boolean,
    price_snapshot: number,
    market_id: string,
    price_open_snapshot: number,
    live: boolean,
    createdAt: Date,
};

const SimulatorsSchema = new Schema<ISimulators>({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    strategies: {
        type: Schema.Types.ObjectId,
        ref: 'Strategies'
    },
    prices_count: {
        type: Number,
        default: 0
    },
    used: {
        type: Boolean
    },
    live: {
        type: Boolean,
    },
    market_id: {
        type: String,
        uppercase: true,
    },
    price_snapshot: {
        type: Number,
    },
    price_open_snapshot: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

export default model<ISimulators>('Simulators', SimulatorsSchema);
