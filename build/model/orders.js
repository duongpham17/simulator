"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrdersSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    simulator: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    leverage: {
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
exports.default = (0, mongoose_1.model)('Orders', OrdersSchema);
