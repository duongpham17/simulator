"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = __importDefault(require("./authentication"));
const strategies_1 = __importDefault(require("./strategies"));
const simulators_1 = __importDefault(require("./simulators"));
const trades_1 = __importDefault(require("./trades"));
const orders_1 = __importDefault(require("./orders"));
const endpoints = (app) => {
    app.use('/api/authentication', authentication_1.default);
    app.use('/api/strategies', strategies_1.default);
    app.use('/api/simulators', simulators_1.default);
    app.use('/api/trades', trades_1.default);
    app.use('/api/orders', orders_1.default);
};
exports.default = endpoints;
