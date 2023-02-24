import { NextFunction, Response } from 'express';
import { kucoin } from '../@api/kucoin';
import { asyncBlock, appError } from '../@utils/helper';
import { InjectUserToRequest } from '../@types/models';

import Trades from '../model/trades';
import Prices from '../model/prices';
import Simulators, {ISimulators} from '../model/simulators';
import Orders, {IOrder} from '../model/orders';
import {IStrategiesInputs} from '../model/strategies';

import {closeTrade, createTrade, updateTrade, strategyTrade} from './middleware/trades';

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
    
    const sims = await Simulators.find({strategies: req.params.id}).sort({createdAt: -1}).select(["prices_count", "createdAt", "used"]);
    
    if(!sims) return new appError("Could not find any trade data", 400);

    for(let i in sims){
        const s = sims[i];
        if(s.used === false) continue;
        const prices_count = await Prices.countDocuments({simulator: s._id});
        const updated_simulator = await Simulators.findByIdAndUpdate(s._id, {prices_count, used: false}, {new: true});
        if(updated_simulator) sims[i] = updated_simulator;
    };

    res.status(200).json({
        status: "success",
        data: sims
    });

});

export const load = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const simulator = await Simulators.findByIdAndUpdate(req.params.id, {used: true}, {new: true});
    
    if(!simulator) return new appError("Could not find simulator data", 400);

    const orders = await Orders.find({simulator: simulator._id});

    if(!orders) return new appError("Could not find order data", 400);

    const prices = await Prices.find({simulator: simulator._id}).sort({createdAt: 1}).limit(2000)

    if(!prices) return new appError("Could not find price data", 400);

    const trades = await Trades.find({simulator: simulator._id});

    if(!trades) return new appError("Could not find trades data", 400);  
    
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

export const open = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const trades = await Trades.find({user: req.user._id});

    if(!trades) return new appError("Could not find open trade data", 400);

    res.status(200).json({
        status: "success",
        data: trades
    })
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

    const price = { 
        price: price_current,
        createdAt: new Date() 
    };

    if(simulator.live) await live.closePosition(order.clientOid);

    const data = await closeTrade({order, price_current, simulator, closed: "manual"});

    res.status(200).json({
        status: "success",
        data: {
            simulator: data.simulator,
            order: data.order,
            price: price
        }
    });
});


///
/// !remember to remove prices that are the same.
///

export const trade = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const [strategy, order, simulator]:[IStrategiesInputs, IOrder, ISimulators] = [req.body.strategy, req.body.order, req.body.simulator];
    
    const kucoin_live = kucoin({
        symbol: strategy.market_id.toUpperCase(), 
        api_key: strategy.api_key, 
        secret_key: strategy.secret_key, 
        passphrase: strategy.passphrase
    });

    const price_current = await kucoin_live.getPrice() as number;

    const price = { 
        price: price_current,
        createdAt: new Date() 
    };

    //setup simulator document
    if(!simulator){
        const sims = await Simulators.create({
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
        })
    };

    await Prices.create({...price, simulator: simulator._id});

    const isOrderOpen = !order ? false : order.open;

    // start trading
    if(isOrderOpen === true) {
        const is_stop_loss = order.side === "buy" ? (order.stop_loss > price_current) : (price_current > order.stop_loss);
        if(is_stop_loss) {
            if(simulator.live) await kucoin_live.closePosition(order.clientOid);
            const data = await closeTrade({order, simulator, price_current});
            return res.status(200).json({ 
                status: "success", 
                data: {
                    simulator: data.simulator,
                    order: data.order,
                    price,
                }
            });
        };

        if(!order.strategy.trailing_take_profit){
            const is_take_profit = order.side === "buy" ? (price_current > order.take_profit) : (order.take_profit > price_current);
            if(is_take_profit) {
                if(simulator.live) await kucoin_live.closePosition(order.clientOid);
                const data = await closeTrade({order, simulator, price_current});
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

        if(order.strategy.trailing_take_profit){
            const is_take_profit = order.side === "buy" ? (price_current > order.take_profit) : (order.take_profit > price_current);
            if(is_take_profit) {
                const updated_order = await updateTrade({strategy, order, price_current});
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
        const {isBuyPrice, isSellPrice} = strategyTrade({
            strategy, 
            price_current, 
            price_snapshot: simulator.price_snapshot
        })
        if(isBuyPrice || isSellPrice) {
            const side = isBuyPrice ? "buy" : "sell";
            let clientOid = "01010101-"+(Math.random() * 100000000000).toString()+"-01010101";
            
            if(simulator.live){
                clientOid = await kucoin_live.placePosition({
                    side,
                    usdtBalance: strategy.usdt_balance,
                    price: price_current,
                    leverage: strategy.leverage,
                    size: strategy.position_size
                }) as string;
            }

            const data = await createTrade({
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