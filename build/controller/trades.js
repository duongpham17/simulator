"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trade = exports.close = exports.open = exports.load = exports.trades = exports.price = void 0;
const kucoin_1 = require("../@api/kucoin");
const helper_1 = require("../@utils/helper");
const trades_1 = __importDefault(require("../model/trades"));
const prices_1 = __importDefault(require("../model/prices"));
const simulators_1 = __importDefault(require("../model/simulators"));
const orders_1 = __importDefault(require("../model/orders"));
const trades_2 = require("./middleware/trades");
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
    const sims = await simulators_1.default.find({ strategies: req.params.id }).sort({ createdAt: -1 }).select(["prices_count", "createdAt", "used"]);
    if (!sims)
        return new helper_1.appError("Could not find any trade data", 400);
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
exports.load = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const simulator = await simulators_1.default.findByIdAndUpdate(req.params.id, { used: true }, { new: true });
    if (!simulator)
        return new helper_1.appError("Could not find simulator data", 400);
    const orders = await orders_1.default.find({ simulator: simulator._id });
    if (!orders)
        return new helper_1.appError("Could not find order data", 400);
    const prices = await prices_1.default.find({ simulator: simulator._id }).sort({ createdAt: 1 }).limit(2000);
    if (!prices)
        return new helper_1.appError("Could not find price data", 400);
    const trades = await trades_1.default.find({ simulator: simulator._id });
    if (!trades)
        return new helper_1.appError("Could not find trades data", 400);
    res.status(200).json({
        status: "success",
        data: {
            simulator,
            prices,
            orders,
            trades
        }
    });
});
exports.open = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const trades = await trades_1.default.find({ user: req.user._id });
    if (!trades)
        return new helper_1.appError("Could not find open trade data", 400);
    res.status(200).json({
        status: "success",
        data: trades
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
    const price = {
        price: price_current,
        createdAt: new Date()
    };
    if (simulator.live)
        await live.closePosition(order.clientOid);
    const data = await (0, trades_2.closeTrade)({ order, price_current, simulator, closed: "manual" });
    res.status(200).json({
        status: "success",
        data: {
            simulator: data.simulator,
            order: data.order,
            price: price
        }
    });
});
exports.trade = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const [strategy, order, simulator, price_previous] = [req.body.strategy, req.body.order, req.body.simulator, req.body.price_previous];
    const kucoin_live = (0, kucoin_1.kucoin)({
        symbol: strategy.market_id.toUpperCase(),
        api_key: strategy.api_key,
        secret_key: strategy.secret_key,
        passphrase: strategy.passphrase
    });
    const price_current = await kucoin_live.getPrice();
    const price = {
        price: price_current,
        createdAt: new Date()
    };
    //setup simulator document
    if (!simulator) {
        const sims = await simulators_1.default.create({
            user: req.user._id,
            strategies: strategy._id,
            market_id: strategy.market_id,
            price_snapshot: price_current,
            price_open_snapshot: price_current,
            reset: 0,
            live: strategy.live,
        });
        return res.status(200).json({
            status: "success",
            data: {
                simulator: sims,
                order: null,
                price,
            }
        });
    }
    ;
    if (price_previous !== price.price)
        await prices_1.default.create({ ...price, simulator: simulator._id });
    const isOrderOpen = !order ? false : order.open;
    // start trading
    if (isOrderOpen === true) {
        const is_stop_loss = order.side === "buy" ? (order.stop_loss > price_current) : (price_current > order.stop_loss);
        if (is_stop_loss) {
            if (simulator.live)
                await kucoin_live.closePosition(order.clientOid);
            const data = await (0, trades_2.closeTrade)({ order, simulator, price_current });
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
        if (!order.strategy.trailing_take_profit) {
            const is_take_profit = order.side === "buy" ? (price_current > order.take_profit) : (order.take_profit > price_current);
            if (is_take_profit) {
                if (simulator.live)
                    await kucoin_live.closePosition(order.clientOid);
                const data = await (0, trades_2.closeTrade)({ order, simulator, price_current });
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
        if (order.strategy.trailing_take_profit) {
            const is_take_profit = order.side === "buy" ? (price_current > order.take_profit) : (order.take_profit > price_current);
            if (is_take_profit) {
                const updated_order = await (0, trades_2.updateTrade)({ strategy, order, price_current });
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
        const { isBuyPrice, isSellPrice } = (0, trades_2.strategyTrade)({
            strategy,
            price_current,
            price_snapshot: simulator.price_snapshot
        });
        if (isBuyPrice || isSellPrice) {
            const side = isBuyPrice ? "buy" : "sell";
            let clientOid = "01010101-" + (Math.random() * 100000000000).toString() + "-01010101";
            if (simulator.live) {
                clientOid = await kucoin_live.placePosition({
                    side,
                    usdtBalance: strategy.usdt_balance,
                    price: price_current,
                    leverage: strategy.leverage,
                    size: strategy.position_size
                });
            }
            const data = await (0, trades_2.createTrade)({
                clientOid,
                simulator,
                strategy,
                price_current,
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
