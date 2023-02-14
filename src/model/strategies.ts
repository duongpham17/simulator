import {Types, Schema, model, Document} from 'mongoose';

export interface IStrategiesInputsSimulate {
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
    createdAt: Date,
};

export interface IStrategiesInputs extends IStrategies {
    usdt_balance: number,
    position_size: number,
    leverage: number,
    reset: number,
    live: boolean,
};

const strategiesSchema = new Schema<IStrategies>({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User' 
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
    take_profit: {
        type: Number
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
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

export default model<IStrategies>('Strategies', strategiesSchema);
