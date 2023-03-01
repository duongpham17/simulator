import { Schema, model } from 'mongoose';
import { ISimulators } from './simulators';

const BotSimulatorsSchema = new Schema<ISimulators>({
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
});

export default model<ISimulators>('BotSimulators', BotSimulatorsSchema);