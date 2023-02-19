import {Price} from '../../model/prices';
import Orders, {IOrder} from '../../model/orders';
import Simulators, {ISimulators} from '../../model/simulators';
import {IStrategies, IStrategiesInputs, IStrategiesInputsSimulate} from '../../model/strategies';

interface OrderCreateTypes {
    simulator: ISimulators, 
    strategy: IStrategiesInputs, 
    side: "buy" | "sell", 
    price: Price[],
    clientOid: string,
}

interface OrderCreateReturn {
    simulator: ISimulators,
    order: IOrder,
}

export const order_create = async ({simulator, strategy, side, price, clientOid}: OrderCreateTypes): Promise<OrderCreateReturn> => {

    const price_current = price[0].price;

    const order = await Orders.create({
        user: simulator.user,
        simulator: simulator._id,
        market_id: strategy.market_id,
        clientOid,
        side,
        moving_price: price_current,
        open_price: price_current,
        stop_loss: side === "sell" ? (price_current + strategy.stop_loss) : (price_current - strategy.stop_loss),
        take_profit: side === "sell" ? (price_current - strategy.take_profit) : (price_current + strategy.take_profit),
        trailing_take_profit: strategy.trailing_take_profit,
        position_size: strategy.position_size,
        strategy: strategy.strategy,
        leverage: strategy.leverage,
        open_at_date: new Date(),
        closed_at_date: new Date(),
        live: simulator.live
    });

    const update_simulator = await Simulators.findByIdAndUpdate(simulator._id, { price_snapshot: price_current}, {new: true});

    return {
        simulator: update_simulator || simulator,
        order
    };
}

interface OrderCloseTypes {
    order: IOrder, 
    simulator: ISimulators,
    price_current: number, 
    closed?: "bot" | "manual",
};

interface OrderCloseReturn {
    order: IOrder,
    simulator: ISimulators,
}

export const order_close = async ({order, price_current, simulator, closed="bot"}: OrderCloseTypes): Promise<OrderCloseReturn> => {

    const updated_order = await Orders.findByIdAndUpdate(order._id, {
        open: false,
        closed,
        closed_at_date: Date.now(),
        close_price: price_current,
        profit_loss: order.side === "buy" ? (price_current - order.open_price) * order.position_size : (order.open_price - price_current) * order.position_size,
    }, 
        {new: true}
    );

    const updated_simulaor = await Simulators.findByIdAndUpdate(simulator._id, {price_snapshot: price_current}, {new: true});
    
    return {
        order: updated_order || order,
        simulator: updated_simulaor || simulator,
    }
};

interface OrderUpdateTypes {
    strategy: IStrategies, 
    order: IOrder, 
    price_current: number, 
}

export const order_update = async ({strategy, order, price_current}: OrderUpdateTypes): Promise<IOrder> => {

    const update_order = await Orders.findByIdAndUpdate(order._id, {
        stop_loss: order.side === "buy" ? order.stop_loss + strategy.stop_loss : order.stop_loss - strategy.stop_loss,
        take_profit:  order.side === "buy" ? order.take_profit + strategy.take_profit : order.take_profit - strategy.take_profit,
        moving_price: price_current
    }, 
        {new: true}
    );

    return update_order || order
};

interface TradingStrategy { 
    strategy: IStrategies | IStrategiesInputsSimulate,
    price_snapshot: number,
    price_current: number,
}

interface TradeStrategyReturn {
    isBuyPrice: boolean,
    isSellPrice: boolean
};

export const order_strategy = ({strategy, price_snapshot, price_current}: TradingStrategy):TradeStrategyReturn  => {
    let isBuyPrice = false;
    let isSellPrice = false;

    if(strategy.strategy === "counter"){
        const buy_price = price_snapshot - Number(strategy.long);
        isBuyPrice = buy_price >= price_current;
    
        const sell_price = price_snapshot + Number(strategy.short);
        isSellPrice = price_current >= sell_price;
    };

    if(strategy.strategy === "counter long only"){
        const buy_price = price_snapshot - Number(strategy.long);
        isBuyPrice = buy_price >= price_current;
    };

    if(strategy.strategy === "counter short only"){
        const sell_price = price_snapshot + Number(strategy.short);
        isSellPrice = price_current >= sell_price;
    };

    if(strategy.strategy === "trend"){
        const buy_price = price_snapshot + Number(strategy.long);
        isBuyPrice = price_current >= buy_price;

        const sell_price = price_snapshot - Number(strategy.short);
        isSellPrice = sell_price >= price_current;
    };

    if(strategy.strategy === "trend long only"){
        const buy_price = price_snapshot + Number(strategy.long);
        isBuyPrice = price_current >= buy_price;
    };

    if(strategy.strategy === "trend short only"){
        const sell_price = price_snapshot - Number(strategy.short);
        isSellPrice = sell_price >= price_current;
    };

    return {
        isBuyPrice,
        isSellPrice
    }

};