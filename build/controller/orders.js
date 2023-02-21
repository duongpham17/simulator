"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders = void 0;
const helper_1 = require("../@utils/helper");
const orders_1 = __importDefault(require("../model/orders"));
exports.orders = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const environment = req.params.environment === "live" ? true : false;
    const data = await orders_1.default.find({ user: req.user._id, live: environment });
    if (!data)
        return new helper_1.appError("Could not get data", 400);
    res.status(200).json({
        status: "success",
        data
    });
});
