import { NextFunction, Response } from 'express';
import { Kucoin, apiActivateKeys } from '../@api/kucoin';
import { asyncBlock, appError } from '../@utils/helper';
import { InjectUserToRequest } from '../@types/models';

import Prices, {Price} from '../model/prices';
import Simulators, {ISimulators} from '../model/simulators';
import {IOrder} from '../model/orders';
import {IStrategiesInputs} from '../model/strategies';

import {order_close, order_create, order_update, order_strategy} from './middleware/trades';

export const price = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const { api_key, secret_key, passphrase, market_id } = req.body

    apiActivateKeys(api_key, secret_key, passphrase);

    const kucoin = new Kucoin(market_id.toUpperCase());

    const price = await kucoin.getPrice();
    
    res.status(200).json({
        status: "success",
        data: price
    })
});

export const trades = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const data = await Simulators.find({strategies: req.params.id}).populate("prices").sort({createdAt: -1})
    
    if(!data) return new appError("Could not get data", 400);

    const shorten_data = data.map(el => ({
        _id: el._id, 
        market_id: el.market_id,
        createdAt: el.createdAt,
        prices: !el.prices ? 0 : el.prices.prices.length,
        orders: el.orders.length
    }));
    
    res.status(200).json({
        status: "success",
        data: shorten_data
    });

});

export const reload = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const data = await Simulators.findById(req.params.id).populate("prices").populate("orders")
    
    if(!data) return new appError("Could not get data", 400);
    
    res.status(200).json({
        status: "success",
        data
    });

});

export const close = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const strategy:IStrategiesInputs = req.body.strategies;
    const simulator:ISimulators = req.body.simulator;
    const order:IOrder = req.body.order;

    apiActivateKeys(strategy.api_key, strategy.secret_key, strategy.passphrase);

    const kucoin = new Kucoin(strategy.market_id);

    const price_current = await kucoin.getPrice() as number;

    const prices = [{
        price: price_current,
        createdAt: new Date()
    }];

    // const closed = await kucoin.closePosition(reqClientOid);

    // if(!closed) return new appError("Could not close position", 401);

    const data = await order_close({order, price_current, simulator, closed: "manual"});

    await Prices.findByIdAndUpdate(simulator.prices, { "$push": { prices: { "$each": prices }}}, {new: true});

    res.status(200).json({
        status: "success",
        data: {
            simulator: data.simulator,
            order: data.order,
            price: Prices
        }
    });
});

export const live = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const [strategy, simulator, order]:[IStrategiesInputs, ISimulators, IOrder] = [req.body.strategy, req.body.simulator, req.body.order];
    
    apiActivateKeys(strategy.api_key, strategy.secret_key, strategy.passphrase);

    const kucoin = new Kucoin(strategy.market_id);

    const price_current = await kucoin.getPrice() as number;

    const price: Price[] = [{
        price: price_current,
        createdAt: new Date()
    }];

    const price_snapshot = simulator === null ? -1 : simulator.price_snapshot;

    //setup simulator document
    if(price_snapshot === -1){
        const p = await Prices.create({price});

        const create_simulator = await Simulators.create({
            user: req.user._id, 
            strategies: strategy._id,
            prices: p._id,
            market_id: strategy.market_id,
            price_snapshot: price_current,
            price_open_snapshot: price_current,
        });

        await Prices.findByIdAndUpdate(p._id, {simulator: create_simulator._id}, {new: true});

        return res.status(200).json({
            status: "success",
            data: {
                simulator: create_simulator,
                order: null,
                price,
            }
        })
    }
    
    await Prices.findByIdAndUpdate(simulator.prices, { "$push": { prices: { "$each": price }}}, {new: true});

    const isOrderOpen = !order ? false : order.open;

    // start to trade
    if(isOrderOpen === true) {
        const is_stop_loss = order.side === "buy" ? (order.stop_loss > price_current) : (price_current > order.stop_loss);
        if(is_stop_loss) {
            // const closed = await kucoin.closePosition(order.clientOid);
            // if(!closed) return;
            const data = await order_close({order, simulator, price_current});
            return res.status(200).json({ 
                status: "success", 
                data: {
                    simulator: data.simulator,
                    order: data.order,
                    price,
                }
            });
        };
        const is_take_trailing_profit = order.side === "buy" ? (price_current > order.trailing_take_profit) : (order.trailing_take_profit > price_current);
        if(is_take_trailing_profit) {
            const data = await order_update({strategy, order, price_current});
            return res.status(200).json({ 
                status: "success", 
                data: {
                    simulator,
                    order: data,
                    price,
                }
            });
        }
    }

    // waiting to open trade
    if(isOrderOpen === false){
        const {isBuyPrice, isSellPrice} = order_strategy({strategy, price_snapshot, price_current})

        if(isBuyPrice || isSellPrice) {
            const side = isBuyPrice ? "buy" : "sell";

            // const kucoin_client_id = await kucoin.placePosition({
            //     side,
            //     usdtBalance: strategy.usdt_balance,
            //     price: price_current,
            //     leverage: strategy.leverage,
            //     size: strategy.position_size
            // });

            // if(!kucoin_client_id) return;

            const data = await order_create({
                clientOid: "10101010101"+(Math.random() * 1000).toString()+"10101010101",
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
    };
    
    return res.status(200).json({
        status: "success",
        data: {
            simulator,
            order: null,
            price,
        }
    });

})

export const test = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const [strategy, simulator, order]:[IStrategiesInputs, ISimulators, IOrder] = [req.body.strategy, req.body.simulator, req.body.order];
    
    apiActivateKeys(strategy.api_key, strategy.secret_key, strategy.passphrase);

    const kucoin = new Kucoin(strategy.market_id);

    const price_current = await kucoin.getPrice() as number;

    const price: Price[] = [{ price: price_current,createdAt: new Date() }];

    const price_snapshot = simulator === null ? -1 : simulator.price_snapshot;

    //setup simulator document
    if(price_snapshot === -1){
        const p = await Prices.create({price});
        const create_simulator = await Simulators.create({
            user: req.user._id, 
            strategies: strategy._id,
            prices: p._id,
            market_id: strategy.market_id,
            price_snapshot: price_current,
            price_open_snapshot: price_current,
            reset: 0
        });
        await Prices.findByIdAndUpdate(p._id, {simulator: create_simulator._id}, {new: true});
        return res.status(200).json({
            status: "success",
            data: {
                simulator: create_simulator,
                order: null,
                price,
            }
        })
    }
    
    await Prices.findByIdAndUpdate(simulator.prices, { "$push": { prices: { "$each": price }}}, {new: true});

    const isOrderOpen = !order ? false : order.open;

    // start trading
    if(isOrderOpen === true) {
        const is_stop_loss = order.side === "buy" ? (order.stop_loss > price_current) : (price_current > order.stop_loss);
        if(is_stop_loss) {
            const data = await order_close({order, simulator, price_current});
            return res.status(200).json({ 
                status: "success", 
                data: {
                    simulator: data.simulator,
                    order: data.order,
                    price,
                }
            });
        };
        const is_take_trailing_profit = order.side === "buy" ? (price_current > order.trailing_take_profit) : (order.trailing_take_profit > price_current);
        if(is_take_trailing_profit) {
            const data = await order_update({strategy, order, price_current});
            return res.status(200).json({ 
                status: "success", 
                data: {
                    simulator,
                    order: data,
                    price,
                }
            });
        }
    }

    const isResetUsed = simulator && strategy.reset === 0 ? false : true;
    const isResetChanged = strategy.reset === 0 && simulator.reset !== 0;

    if(isResetChanged) {
        const data = await Simulators.findByIdAndUpdate(simulator._id, {reset: 0}, {new: true});
        return res.status(200).json({
            status: "success",
            data: {
                simulator: data,
                order: null,
                price,
            }
        })
    };

    if(isResetUsed){
        const isResetTime = Date.now() > simulator.reset;
        const isFirstTime = simulator.reset === 0 && strategy.reset >= 0;
        if(isResetTime || isFirstTime) {
            const milliseconds = strategy.reset * 60000;
            const data = await Simulators.findByIdAndUpdate(simulator._id, {
                reset: Date.now() + milliseconds, 
                price_snapshot: price_current
            }, 
                {new: true}
            );
            return res.status(200).json({
                status: "success",
                data: {
                    simulator: data,
                    order: null,
                    price,
                }
            })
        }
    };

    if(isOrderOpen === false){
        const {isBuyPrice, isSellPrice} = order_strategy({strategy, price_snapshot, price_current})
        if(isBuyPrice || isSellPrice) {
            const side = isBuyPrice ? "buy" : "sell";
            const data = await order_create({
                clientOid: "10101010101"+(Math.random() * 1000).toString()+"10101010101",
                simulator, 
                strategy, 
                price, 
                side, 
                live: false,
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
    };

    return res.status(200).json({
        status: "success",
        data: {
            simulator,
            order: null,
            price,
        }
    });
});