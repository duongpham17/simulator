import {Types, Schema, model, Document} from 'mongoose';

export interface IOrder extends Partial<Document> {
    simulator: Types.ObjectId,
    open: boolean,
    clientOid: string,
    closed: "manual" | "bot",
    side: "buy" | "sell",
    live: boolean,
    open_price: number,
    close_price: number,
    moving_price: number,
    stop_loss: number,
    trailing_take_profit: number,
    profit_loss: number,
    position_size: number,
    leverage: number,
    strategy: string,
    closed_at_date: Date,
    open_at_date: Date,
}

const OrdersSchema = new Schema<IOrder>({
    simulator: {
        type: Schema.Types.ObjectId,
        ref: 'Simulators'
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
    trailing_take_profit: {
        type: Number,
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
    live: {
        type: Boolean,
        default: true,
    },
    closed_at_date: {
        type: Date,
        default: Date.now()
    },
    open_at_date: {
        type: Date,
        default: Date.now()
    },
});

export default model<IOrder>('Orders', OrdersSchema);
