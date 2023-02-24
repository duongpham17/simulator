"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const SimulatorsSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    strategies: {
        type: mongoose_1.Schema.Types.ObjectId,
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
    reset: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});
exports.default = (0, mongoose_1.model)('Simulators', SimulatorsSchema);
