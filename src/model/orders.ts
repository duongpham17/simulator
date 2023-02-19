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
    trailing_take_profit: boolean,
    take_profit: number,
    profit_loss: number,
    position_size: number,
    leverage: number,
    strategy: string,
    closed_at_date: Date,
    open_at_date: Date,
    live: boolean,
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
        enum: ["maunal", "bot"]
    },
    open: {
        type: Boolean,
        default: true
    },
    clientOid: {
        type: String
    },
    strategy: {
        type: String,
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
    trailing_take_profit: {
        type: Boolean
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
