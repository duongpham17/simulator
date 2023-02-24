"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulate = exports.remove = exports.simulator = exports.resync = exports.simulators = void 0;
const helper_1 = require("../@utils/helper");
const trades_1 = __importDefault(require("../model/trades"));
const prices_1 = __importDefault(require("../model/prices"));
const simulators_1 = __importDefault(require("../model/simulators"));
const orders_1 = __importDefault(require("../model/orders"));
const trades_2 = require("./middleware/trades");
exports.simulators = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const sims = await simulators_1.default.find({ user: req.user._id }).sort({ createdAt: -1 });
    if (!sims)
        return new helper_1.appError("Could not get data", 400);
    for (let i in sims) {
        const s = sims[i];
        if (s.used === false)
            continue;
        const prices_count = await prices_1.default.countDocuments({ simulator: s._id });
        const updated_simulator = await simulators_1.default.findByIdAndUpdate(s._id, { prices_count, used: false }, { new: true });
        if (updated_simulator)
            sims[i] = updated_simulator;
    }
    ;
    res.status(200).json({
        status: "success",
        data: sims
    });
});
exports.resync = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const simulator = await simulators_1.default.findById(req.params.id);
    if (!simulator)
        return new helper_1.appError("Could not get simulator data", 400);
    const prices_count = await prices_1.default.countDocuments({ simulator: simulator._id });
    if (!prices_count)
        return new helper_1.appError("Could not get prices data", 400);
    simulator.prices_count = prices_count;
    await simulator.save();
    res.status(200).json({
        status: "success",
        data: simulator
    });
});
exports.simulator = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const simulator = await simulators_1.default.findByIdAndUpdate(req.params.id);
    if (!simulator)
        return new helper_1.appError("Could not get data", 400);
    const orders = await orders_1.default.find({ simulator: simulator._id });
    if (!orders)
        return new helper_1.appError("Could not get data", 400);
    res.status(200).json({
        status: "success",
        data: {
            simulator,
            orders
        }
    });
});
exports.remove = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const simulator = await simulators_1.default.findByIdAndDelete(req.params.id);
    if (!simulator)
        return new helper_1.appError("Could not delete data", 400);
    await prices_1.default.deleteMany({ simulator: simulator._id });
    await orders_1.default.deleteMany({ simulator: simulator._id });
    await trades_1.default.deleteMany({ simulator: simulator._id });
    res.status(200).json({
        status: "success",
    });
});
exports.simulate = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const [strategy, simulatorId] = [req.body.strategy, req.body.simulatorId];
    const simulator = await simulators_1.default.findById(simulatorId).populate("strategies");
    if (!simulator)
        return new helper_1.appError("Could not get simulate data", 400);
    const prices = await prices_1.default.find({ simulator: simulator._id });
    if (!prices)
        return new helper_1.appError("Could not get simulate data", 400);
    const last_price_date = Date.parse(prices.slice(-1)[0].createdAt.toISOString());
    const orders = [];
    let initial_reset_timer = Date.parse(prices[0].createdAt.toISOString()) + (strategy.reset * 60000);
    let price_snapshot = prices[0].price;
    let open_order = undefined;
    for (let p of prices) {
        const [price_current, time_current] = [p.price, Date.parse(p.createdAt.toISOString())];
        const isOpen = !open_order ? false : open_order.open;
        if (open_order) {
            const is_stop_loss = open_order.side === "buy" ? (open_order.stop_loss > price_current) : (price_current > open_order.stop_loss);
            const is_last_iteration = time_current === last_price_date;
            if (is_stop_loss || is_last_iteration) {
                const order_closed = {
                    ...open_order,
                    open: false,
                    closed_at_date: p.createdAt,
                    close_price: price_current,
                    profit_loss: open_order.side === "buy" ? (price_current - open_order.open_price) * open_order.position_size : (open_order.open_price - price_current) * open_order.position_size,
                    closed: "bot",
                };
                orders.push(order_closed);
                price_snapshot = price_current;
                open_order = undefined;
                continue;
            }
            ;
            if (!open_order.strategy.trailing_take_profit) {
                const is_take_profit = open_order.side === "buy" ? (price_current > open_order.take_profit) : (open_order.take_profit > price_current);
                if (is_take_profit) {
                    const order_closed = {
                        ...open_order,
                        open: false,
                        closed_at_date: p.createdAt,
                        close_price: price_current,
                        profit_loss: open_order.side === "buy" ? (price_current - open_order.open_price) * open_order.position_size : (open_order.open_price - price_current) * open_order.position_size,
                        closed: "bot",
                    };
                    orders.push(order_closed);
                    price_snapshot = price_current;
                    open_order = undefined;
                    continue;
                }
                ;
            }
            if (open_order.strategy.trailing_take_profit) {
                const is_take_profit = open_order.side === "buy" ? (price_current > open_order.take_profit) : (open_order.take_profit > price_current);
                if (is_take_profit) {
                    const updated_order = {
                        ...open_order,
                        stop_loss: open_order.side === "buy" ? open_order.stop_loss + strategy.stop_loss : open_order.stop_loss - strategy.stop_loss,
                        take_profit: open_order.side === "buy" ? open_order.take_profit + strategy.take_profit : open_order.take_profit - strategy.take_profit,
                        moving_price: price_current,
                    };
                    open_order = updated_order;
                    continue;
                }
                ;
            }
        }
        ;
        const isResetTimer = !strategy.reset ? false : time_current > initial_reset_timer;
        if (isResetTimer && !isOpen) {
            price_snapshot = price_current;
            initial_reset_timer = time_current + (strategy.reset * 60000);
            continue;
        }
        ;
        if (isOpen === false) {
            const { isBuyPrice, isSellPrice } = (0, trades_2.strategyTrade)({ strategy, price_snapshot, price_current });
            if (isBuyPrice || isSellPrice) {
                const side = isBuyPrice ? "buy" : "sell";
                const order = {
                    user: simulator.user,
                    simulator: simulator._id,
                    market_id: simulator.market_id,
                    open: true,
                    side,
                    clientOid: `sim-id-${Math.random().toString(36).substring(7)}`,
                    moving_price: price_current,
                    open_price: price_current,
                    stop_loss: side === "sell" ? (price_current + strategy.stop_loss) : (price_current - strategy.stop_loss),
                    take_profit: side === "sell" ? (price_current - strategy.take_profit) : (price_current + strategy.take_profit),
                    position_size: strategy.position_size,
                    leverage: strategy.leverage,
                    open_at_date: p.createdAt,
                    closed_at_date: new Date(),
                    profit_loss: 0,
                    close_price: 0,
                    closed: "bot",
                    live: simulator.live,
                    strategy: { ...strategy }
                };
                open_order = order;
            }
            ;
        }
        ;
    }
    ;
    const simulator_data = {
        _id: simulator._id,
        strategies: simulator.strategies._id,
        user: simulator.user,
        market_id: simulator.market_id,
        price_snapshot: prices[0].price,
        price_open_snapshot: prices[0].price,
        reset: strategy.reset,
        live: simulator.live,
        prices_count: prices.length,
        used: false,
        createdAt: new Date(),
    };
    res.status(200).json({
        status: "success",
        data: {
            simulator: simulator_data,
            strategy: { ...simulator.strategies._doc, ...strategy },
            orders
        }
    });
});
