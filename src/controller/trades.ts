import { NextFunction, Response } from 'express';
import { kucoin } from '../@api/kucoin';
import { asyncBlock, appError } from '../@utils/helper';
import { InjectUserToRequest } from '../@types/models';

import Prices, {Price} from '../model/prices';
import Simulators, {ISimulators} from '../model/simulators';
import Orders, {IOrder} from '../model/orders';
import {IStrategiesInputs} from '../model/strategies';

import {order_close, order_create, order_update, order_strategy} from './middleware/trades';

export const price = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const { api_key, secret_key, passphrase, market_id } = req.body

    const live = kucoin({symbol: market_id.toUpperCase(), api_key, secret_key, passphrase});

    const price = await live.getPrice();
    
    res.status(200).json({
        status: "success",
        data: price
    })
});

export const trades = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const data = await Simulators.find({strategies: req.params.id}).populate("prices").sort({createdAt: -1});
    
    if(!data) return new appError("Could not get data", 400);

    const shorten_data = data.map(el => ({
        _id: el._id, 
        market_id: el.market_id,
        createdAt: el.createdAt,
        prices: !el.prices ? 0 : el.prices.prices.length,
    }));
    
    res.status(200).json({
        status: "success",
        data: shorten_data
    });

});

export const load = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const simulator = await Simulators.findById(req.params.id);
    
    if(!simulator) return new appError("Could not get data", 400);

    const orders = await Orders.find({simulator: simulator._id});

    if(!orders) return new appError("Could not get data", 400);

    const prices = await Prices.find({simulator: simulator._id});

    if(!prices) return new appError("Could not get data", 400);
    
    res.status(200).json({
        status: "success",
        data: {
            simulator,
            orders,
            prices
        }
    });

});

export const close = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const strategy:IStrategiesInputs = req.body.strategies;
    const simulator:ISimulators = req.body.simulator;
    const order:IOrder = req.body.order;

    const live = kucoin({
        symbol: strategy.market_id.toUpperCase(), 
        api_key: strategy.api_key, 
        secret_key: strategy.secret_key, 
        passphrase: strategy.passphrase
    });

    const price_current = await live.getPrice() as number;

    const prices = [{
        price: price_current,
        createdAt: new Date()
    }];

    if(simulator.live) await live.closePosition(order.clientOid);

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

export const trade = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const [strategy, simulator, order]:[IStrategiesInputs, ISimulators, IOrder] = [req.body.strategy, req.body.simulator, req.body.order];
    
    const live = kucoin({
        symbol: strategy.market_id.toUpperCase(), 
        api_key: strategy.api_key, 
        secret_key: strategy.secret_key, 
        passphrase: strategy.passphrase
    });

    strategy.api_key, strategy.secret_key, strategy.passphrase

    const price_current = await live.getPrice() as number;

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
            reset: 0,
            live: strategy.live,
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
            if(simulator.live) await live.closePosition(order.clientOid);
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

        if(!order.trailing_take_profit){
            const is_take_profit = order.side === "buy" ? (price_current > order.take_profit) : (order.take_profit > price_current);
            if(is_take_profit) {
                if(simulator.live) await live.closePosition(order.clientOid);
                const data = await order_close({order, simulator, price_current});
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

        if(order.trailing_take_profit){
            const is_take_profit = order.side === "buy" ? (price_current > order.take_profit) : (order.take_profit > price_current);
            if(is_take_profit) {
                const updated_order = await order_update({strategy, order, price_current});
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
            let clientOid = "01010101-"+(Math.random() * 100000000000).toString()+"-01010101";
            
            if(simulator.live){
                clientOid = await live.placePosition({
                    side,
                    usdtBalance: strategy.usdt_balance,
                    price: price_current,
                    leverage: strategy.leverage,
                    size: strategy.position_size
                }) as string;
            }

            const data = await order_create({
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