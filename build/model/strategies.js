"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
;
;
const strategiesSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    reset: {
        type: Number,
    },
    api_key: {
        type: String
    },
    secret_key: {
        type: String
    },
    passphrase: {
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
exports.default = (0, mongoose_1.model)('Strategies', strategiesSchema);
