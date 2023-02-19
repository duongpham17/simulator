import { NextFunction, Response } from 'express';
import { asyncBlock, appError } from '../@utils/helper';
import { InjectUserToRequest } from '../@types/models';

import Prices, {Price} from '../model/prices';
import Simulators, {ISimulators} from '../model/simulators';
import Orders, {IOrder} from '../model/orders';
import {IStrategiesInputsSimulate} from '../model/strategies';

import {order_strategy} from './middleware/trades';

export const simulators = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const data = await Simulators.find({user: req.user._id}).populate("prices").sort({createdAt: -1})

    if(!data) return new appError("Could not get data", 400);

    const shorten_data = data.map(el => ({
        _id: el._id, 
        market_id: el.market_id,
        createdAt: el.createdAt,
        prices: !el.prices ? 0 : el.prices.prices.length,
        live: el.live
    }));

    res.status(200).json({
        status: "success",
        data: shorten_data
    })
});

export const simulator = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    
    const simulator = await Simulators.findById(req.params.id)
    
    if(!simulator) return new appError("Could not get data", 400);

    const orders = await Orders.find({simulator: simulator._id});

    if(!orders) return new appError("Could not get data", 400);
    
    res.status(200).json({
        status: "success",
        data: {
            simulator,
            orders
        }
    });

});

export const remove = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const simulator = await Simulators.findByIdAndDelete(req.params.id);

    if(!simulator) return new appError("Could not delete data", 400);

    await Prices.findByIdAndDelete(simulator.prices);

    await Orders.deleteMany({simulator: simulator._id});

    res.status(200).json({
        status: "success",
    })
});

export const simulate = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const strategy: IStrategiesInputsSimulate = req.body.strategy;
    const simulatorId = req.body.simulatorId;

    const simulator = await Simulators.findById(simulatorId).populate("prices").populate("strategies");

    if(!simulator) return new appError("Could not get simulate data", 400);

    const prices: Price[] = simulator.prices.prices;

    const last_price_date = Date.parse(prices.slice(-1)[0].createdAt.toISOString());

    const orders: IOrder[] = [];

    let initial_reset_timer = Date.parse(prices[0].createdAt.toISOString()) + (strategy.reset * 60000);

    let price_snapshot = prices[0].price;

    let open_order: IOrder | undefined =  undefined;

    for(let p of prices) {

        const [price_current, time_current] = [p.price, Date.parse(p.createdAt.toISOString())];

        const isOpen = !open_order ? false : open_order.open;
        
        if(open_order) {
            const is_stop_loss = open_order.side === "buy" ? (open_order.stop_loss > price_current) : (price_current > open_order.stop_loss);
            const is_last_iteration = time_current === last_price_date;
            if(is_stop_loss || is_last_iteration) {
                const order_closed: IOrder = {
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
            };

            if(!open_order.trailing_take_profit){
                const is_take_profit = open_order.side === "buy" ? (price_current > open_order.take_profit) : (open_order.take_profit > price_current);
                if(is_take_profit) {
                    const order_closed: IOrder = {
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
                };
            }
    
            if(open_order.trailing_take_profit){
                const is_take_profit = open_order.side === "buy" ? (price_current > open_order.take_profit) : (open_order.take_profit > price_current);
                if(is_take_profit) {
                    const updated_order: IOrder = {
                        ...open_order,
                        stop_loss: open_order.side === "buy" ? open_order.stop_loss + strategy.stop_loss : open_order.stop_loss - strategy.stop_loss,
                        take_profit:  open_order.side === "buy" ? open_order.take_profit + strategy.take_profit : open_order.take_profit - strategy.take_profit,
                        moving_price: price_current,
                    };
                    open_order = updated_order
                    continue;
                };
            }
        };

        const isResetTimer = !strategy.reset ? false : time_current > initial_reset_timer;

        if(isResetTimer && !isOpen){
            price_snapshot = price_current;
            initial_reset_timer = time_current + (strategy.reset * 60000);
            continue;
        };

        if(isOpen === false){
            const {isBuyPrice, isSellPrice} = order_strategy({strategy, price_snapshot, price_current});
            if(isBuyPrice || isSellPrice) {
                const side = isBuyPrice ? "buy" : "sell";
                const order: IOrder = {
                    ...strategy,
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
                };
                open_order = order;
            };
        };
    };
    
    const simulator_data: ISimulators = {
        _id: simulator._id,
        strategies: simulator.strategies._id,
        user: simulator.user,
        market_id: simulator.market_id,
        prices: simulator.prices._id,
        price_snapshot: prices[0].price,
        price_open_snapshot: prices[0].price,
        createdAt: new Date(),
        reset: strategy.reset,
        live: simulator.live,
    };

    res.status(200).json({
        status: "success",
        data: {
            simulator: simulator_data,
            strategy: {...simulator.strategies._doc, ...strategy},
            orders
        }
    });

});