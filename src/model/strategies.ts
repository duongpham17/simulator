import {Types, Schema, model, Document} from 'mongoose';

export interface IStrategies extends Document {
    user: Types.ObjectId,
    market_id: string,
    exchange: string,
    name: string,
    strategy: string,
    short: number,
    long: number,
    stop_loss: number,
    trailing_take_profit: boolean,
    take_profit: number,
    api_key: string,
    secret_key: string,
    passphrase: string,
    favourite: boolean,
    reset: number,
    usdt_balance: number,
    position_size: number,
    leverage: number,
    live: boolean,
    createdAt: Date,
};

const strategiesSchema = new Schema<IStrategies>({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    live: {
        type: Boolean
    },
    name: {
        type: String
    },
    exchange: {
        type: String,
    },
    market_id: {
        type: String,
    },
    strategy: {
        type: String
    },
    short: {
        type: Number
    },
    long: {
        type: Number
    },
    stop_loss: {
        type: Number
    },
    trailing_take_profit: {
        type: Boolean
    },
    position_size: {
        type: Number
    },
    usdt_balance: {
        type: Number
    },
    leverage:{
        type: Number,
    },
    take_profit: {
        type: Number
    },
    reset:{
        type: Number,
    },
    api_key: {
        type: String
    },
    secret_key: {
        type: String
    },
    passphrase:{
        type: String
    },
    favourite: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

export default model<IStrategies>('Strategies', strategiesSchema);
