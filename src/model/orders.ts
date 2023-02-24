import {Types, Schema, model, Document} from 'mongoose';

export interface IOrder extends Partial<Document> {
    user: Types.ObjectId,
    simulator: Types.ObjectId,
    market_id: string,
    open: boolean,
    clientOid: string,
    closed: "manual" | "bot",
    side: "buy" | "sell",
    open_price: number,
    close_price: number,
    moving_price: number,
    stop_loss: number,
    take_profit: number,
    profit_loss: number,
    position_size: number,
    leverage: number,
    closed_at_date: Date,
    open_at_date: Date,
    live: boolean,
    strategy: {
        strategy: string,
        short: number,
        long: number,
        stop_loss: number,
        trailing_take_profit: boolean,
        take_profit: number,
        reset: number
    },
}

const OrdersSchema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    simulator: {
        type: Schema.Types.ObjectId,
        ref: 'Simulators'
    },
    market_id: {
        type: String,
        uppercase: true,
    },
    closed: {
        type: String,
        enum: ["manual", "bot"]
    },
    open: {
        type: Boolean,
        default: true
    },
    clientOid: {
        type: String
    },
    strategy: {
        strategy: String,
        short: Number,
        long: Number,
        stop_loss: Number,
        trailing_take_profit: Boolean,
        take_profit: Number,
        reset: Number,
    },
    side: {
        type: String,
        enum: ["buy", "sell"]
    },
    moving_price: {
        type: Number
    },
    open_price: {
        type: Number
    },
    close_price: {
        type: Number,
        default: 0
    },
    stop_loss: {
        type: Number
    },
    take_profit: {
        type: Number
    },
    profit_loss: {
        type: Number,
        default: 0
    },
    position_size: {
        type: Number,
    },
    leverage:{
        type: Number
    },
    closed_at_date: {
        type: Date,
        default: Date.now()
    },
    open_at_date: {
        type: Date,
        default: Date.now()
    },
    live: {
        type: Boolean,
    }
});

export default model<IOrder>('Orders', OrdersSchema);
