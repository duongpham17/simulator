import {Types, Schema, model, PopulatedDoc, Document} from 'mongoose';
import {IPrices} from './prices';
import {IStrategies} from './strategies';
import {IUsers} from './users';
import {IOrder} from './orders';

export interface ISimulators extends Partial<Document> {
    user: PopulatedDoc<Types.ObjectId & IUsers>,
    strategies: PopulatedDoc<Types.ObjectId & IStrategies>,
    prices: PopulatedDoc<Types.ObjectId & IPrices>,
    orders: PopulatedDoc<Types.ObjectId[] & IOrder>,
    price_snapshot: number,
    market_id: string,
    price_open_snapshot: number,
    reset: number,
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
    prices: {
        type: Schema.Types.ObjectId,
        ref: 'Prices'
    },
    orders:[{
        type: Schema.Types.ObjectId,
        ref: "Orders"
    }],
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
    reset: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

export default model<ISimulators>('Simulators', SimulatorsSchema);
