"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
;
const PricesSchema = new mongoose_1.Schema({
    simulator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Simulators'
    },
    prices: [
        {
            price: Number,
            createdAt: Date,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
});
exports.default = (0, mongoose_1.model)('Prices', PricesSchema);
