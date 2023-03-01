import Trades from '../../model/botTrades';
import Orders, {IOrder} from '../../model/orders';
import Simulators, {ISimulators, ISimulateInputs} from '../../model/simulators';
import {IStrategies} from '../../model/strategies';

interface OrderCreateTypes {
    simulator: ISimulators, 
    strategy: IStrategies, 
    side: "buy" | "sell", 
    price_current: number,
    clientOid: string,
}

interface OrderCreateReturn {
    simulator: ISimulators,
    order: IOrder,
}

export const createTrade = async ({simulator, strategy, side, price_current, clientOid}: OrderCreateTypes): Promise<OrderCreateReturn> => {

    const order = await Trades.create({
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
        leverage: strategy.leverage,
        open_at_date: new Date(),
        closed_at_date: new Date(),
        live: simulator.live,
        strategy: {...strategy}
    });

    const update_simulator = await Simulators.findByIdAndUpdate(simulator._id, { 
        price_snapshot: price_current
    }, 
        { new: true }
    ) as ISimulators;

    return {
        simulator: update_simulator,
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

export const closeTrade = async ({order, price_current, simulator, closed="bot"}: OrderCloseTypes): Promise<OrderCloseReturn> => {

    await Trades.findByIdAndDelete(order._id);

    const create_order_closed = await Orders.create({
        ...order,
        open: false,
        closed,
        closed_at_date: Date.now(),
        close_price: price_current,
        profit_loss: order.side === "buy" ? (price_current - order.open_price) * order.position_size : (order.open_price - price_current) * order.position_size,
    });

    const updated_simulaor = await Simulators.findByIdAndUpdate(simulator._id, {price_snapshot: price_current}, {new: true});
    
    return {
        order: create_order_closed || order,
        simulator: updated_simulaor || simulator,
    }
};

interface OrderUpdateTypes {
    strategy: IStrategies, 
    order: IOrder, 
    price_current: number, 
}

export const updateTrade = async ({strategy, order, price_current}: OrderUpdateTypes): Promise<IOrder> => {

    const update_trades = await Trades.findByIdAndUpdate(order._id, {
        stop_loss: order.side === "buy" ? order.stop_loss + strategy.stop_loss : order.stop_loss - strategy.stop_loss,
        take_profit:  order.side === "buy" ? order.take_profit + strategy.take_profit : order.take_profit - strategy.take_profit,
        moving_price: price_current
    }, 
        {new: true}
    );

    return update_trades || order
};

interface TradingStrategy { 
    strategy: IStrategies | ISimulateInputs,
    price_snapshot: number,
    price_current: number,
}

interface TradeStrategyReturn {
    isBuyPrice: boolean,
    isSellPrice: boolean
};

export const strategyTrade = ({strategy, price_snapshot, price_current}: TradingStrategy):TradeStrategyReturn  => {
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