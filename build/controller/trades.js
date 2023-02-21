"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trade = exports.close = exports.load = exports.trades = exports.price = void 0;
const kucoin_1 = require("../@api/kucoin");
const helper_1 = require("../@utils/helper");
const prices_1 = __importDefault(require("../model/prices"));
const simulators_1 = __importDefault(require("../model/simulators"));
const orders_1 = __importDefault(require("../model/orders"));
const trades_1 = require("./middleware/trades");
exports.price = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const { api_key, secret_key, passphrase, market_id } = req.body;
    const live = (0, kucoin_1.kucoin)({ symbol: market_id.toUpperCase(), api_key, secret_key, passphrase });
    const price = await live.getPrice();
    res.status(200).json({
        status: "success",
        data: price
    });
});
exports.trades = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const sims = await simulators_1.default.find({ strategies: req.params.id }).sort({ createdAt: -1 });
    if (!sims)
        return new helper_1.appError("Could not find any trade data", 400);
    for (let i in sims) {
        const s = sims[i];
        if (s.used === false)
            continue;
        try {
            const prices = await prices_1.default.findById(s.prices);
            const updated_simulator = await simulators_1.default.findByIdAndUpdate(s._id, { prices_count: prices.prices.length, used: false }, { new: true });
            if (updated_simulator)
                sims[i] = updated_simulator;
        }
        catch (_) {
            console.log(_);
        }
    }
    ;
    res.status(200).json({
        status: "success",
        data: sims
    });
});
exports.load = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const simulator = await simulators_1.default.findByIdAndUpdate(req.params.id, { used: true }, { new: true });
    if (!simulator)
        return new helper_1.appError("Could not find simulator data", 400);
    const orders = await orders_1.default.find({ simulator: simulator._id });
    if (!orders)
        return new helper_1.appError("Could not find order data", 400);
    const prices = await prices_1.default.findById(simulator.prices);
    if (!prices)
        return new helper_1.appError("Could not find price data", 400);
    res.status(200).json({
        status: "success",
        data: {
            simulator,
            orders,
            prices
        }
    });
});
exports.close = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const strategy = req.body.strategies;
    const simulator = req.body.simulator;
    const order = req.body.order;
    const live = (0, kucoin_1.kucoin)({
        symbol: strategy.market_id.toUpperCase(),
        api_key: strategy.api_key,
        secret_key: strategy.secret_key,
        passphrase: strategy.passphrase
    });
    const price_current = await live.getPrice();
    const prices = [{
            price: price_current,
            createdAt: new Date()
        }];
    if (simulator.live)
        await live.closePosition(order.clientOid);
    const data = await (0, trades_1.order_close)({ order, price_current, simulator, closed: "manual" });
    await prices_1.default.findByIdAndUpdate(simulator.prices, { "$push": { prices: { "$each": prices } } }, { new: true });
    res.status(200).json({
        status: "success",
        data: {
            simulator: data.simulator,
            order: data.order,
            price: prices_1.default
        }
    });
});
exports.trade = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const [strategy, simulator, order] = [req.body.strategy, req.body.simulator, req.body.order];
    const live = (0, kucoin_1.kucoin)({
        symbol: strategy.market_id.toUpperCase(),
        api_key: strategy.api_key,
        secret_key: strategy.secret_key,
        passphrase: strategy.passphrase
    });
    strategy.api_key, strategy.secret_key, strategy.passphrase;
    const price_current = await live.getPrice();
    const price = [{ price: price_current, createdAt: new Date() }];
    const price_snapshot = simulator === null ? -1 : simulator.price_snapshot;
    //setup simulator document
    if (price_snapshot === -1) {
        const p = await prices_1.default.create({ price });
        const create_simulator = await simulators_1.default.create({
            user: req.user._id,
            strategies: strategy._id,
            prices: p._id,
            market_id: strategy.market_id,
            price_snapshot: price_current,
            price_open_snapshot: price_current,
            reset: 0,
            live: strategy.live,
        });
        await prices_1.default.findByIdAndUpdate(p._id, { simulator: create_simulator._id }, { new: true });
        return res.status(200).json({
            status: "success",
            data: {
                simulator: create_simulator,
                order: null,
                price,
            }
        });
    }
    await prices_1.default.findByIdAndUpdate(simulator.prices, { "$push": { prices: { "$each": price } } }, { new: true });
    const isOrderOpen = !order ? false : order.open;
    // start trading
    if (isOrderOpen === true) {
        const is_stop_loss = order.side === "buy" ? (order.stop_loss > price_current) : (price_current > order.stop_loss);
        if (is_stop_loss) {
            if (simulator.live)
                await live.closePosition(order.clientOid);
            const data = await (0, trades_1.order_close)({ order, simulator, price_current });
            return res.status(200).json({
                status: "success",
                data: {
                    simulator: data.simulator,
                    order: data.order,
                    price,
                }
            });
        }
        ;
        if (!order.trailing_take_profit) {
            const is_take_profit = order.side === "buy" ? (price_current > order.take_profit) : (order.take_profit > price_current);
            if (is_take_profit) {
                if (simulator.live)
                    await live.closePosition(order.clientOid);
                const data = await (0, trades_1.order_close)({ order, simulator, price_current });
                return res.status(200).json({
                    status: "success",
                    data: {
                        simulator: data.simulator,
                        order: data.order,
                        price,
                    }
                });
            }
        }
        if (order.trailing_take_profit) {
            const is_take_profit = order.side === "buy" ? (price_current > order.take_profit) : (order.take_profit > price_current);
            if (is_take_profit) {
                const updated_order = await (0, trades_1.order_update)({ strategy, order, price_current });
                return res.status(200).json({
                    status: "success",
                    data: {
                        simulator,
                        order: updated_order,
                        price,
                    }
                });
            }
        }
    }
    const isResetUsed = simulator && strategy.reset === 0 ? false : true;
    const isResetChanged = strategy.reset === 0 && simulator.reset !== 0;
    if (isResetChanged) {
        const data = await simulators_1.default.findByIdAndUpdate(simulator._id, { reset: 0 }, { new: true });
        return res.status(200).json({
            status: "success",
            data: {
                simulator: data,
                order: null,
                price,
            }
        });
    }
    ;
    if (isResetUsed) {
        const isResetTime = Date.now() > simulator.reset;
        const isFirstTime = simulator.reset === 0 && strategy.reset >= 0;
        if (isResetTime || isFirstTime) {
            const milliseconds = strategy.reset * 60000;
            const data = await simulators_1.default.findByIdAndUpdate(simulator._id, {
                reset: Date.now() + milliseconds,
                price_snapshot: price_current
            }, { new: true });
            return res.status(200).json({
                status: "success",
                data: {
                    simulator: data,
                    order: null,
                    price,
                }
            });
        }
    }
    ;
    if (isOrderOpen === false) {
        const { isBuyPrice, isSellPrice } = (0, trades_1.order_strategy)({ strategy, price_snapshot, price_current });
        if (isBuyPrice || isSellPrice) {
            const side = isBuyPrice ? "buy" : "sell";
            let clientOid = "01010101-" + (Math.random() * 100000000000).toString() + "-01010101";
            if (simulator.live) {
                clientOid = await live.placePosition({
                    side,
                    usdtBalance: strategy.usdt_balance,
                    price: price_current,
                    leverage: strategy.leverage,
                    size: strategy.position_size
                });
            }
            const data = await (0, trades_1.order_create)({
                clientOid,
                simulator,
                strategy,
                price,
                side,
            });
            return res.status(200).json({
                status: "success",
                data: {
                    simulator: data.simulator,
                    order: data.order,
                    price,
                }
            });
        }
    }
    return res.status(200).json({
        status: "success",
        data: {
            simulator,
            order: null,
            price,
        }
    });
});
