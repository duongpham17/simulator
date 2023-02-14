import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { IOrders } from '@redux/types/trades';
import { ISimulator } from '@redux/types/simulators';
import { IStrategies } from '@redux/types/strategies';
import { date, timerGreater24 } from '@utils/functions';
import { find_side } from '@data/strategies';
import Trades from '@redux/actions/trades';

import Container1 from '@components/container/Style1';
import Container2 from '@components/container/Style2';
import Text2 from '@components/text/Style2';
import Text3 from '@components/text/Style3';
import Flex from '@components/flex/Flex';
import Button from '@components/buttons/Button';

interface PropsRunning {
    trading: ISimulator,
    orders: IOrders[],
    strategy: IStrategies,
    price_latest: number,
    isTrading: boolean,
}

const Running = ({orders, strategy, trading, price_latest, isTrading}: PropsRunning) => {

    const trade = orders.slice(-1)[0];

    const [isClosing, setIsClosing] = useState(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => setIsClosing(false);
    }, [orders]);

    const onCloseOrder = async (orders: IOrders) => {
        if(isClosing) return;
        setIsClosing(true);
        await dispatch(Trades.close(strategy, trading, orders));
    };

    const profit_calculator = (side: string, open_price: number, current_price: number): number => {
        if(current_price === 0) return 0
        if(side === "buy"){
            return current_price - open_price;
        } else {
            return open_price - current_price;
        }
    };

    const calc_difference = (current: number, target: number, decimal_places=5): number => {
        return Math.abs(Number((target-current).toFixed(decimal_places)))
    };

    const profit_loss = profit_calculator(trade.side, trade.open_price, price_latest)

    const trailing_take_profit_difference = calc_difference(trade.trailing_take_profit, price_latest).toFixed(5)

    const stop_loss_difference = calc_difference(trade.stop_loss, price_latest).toFixed(5)

    return( trade ? 
            <Container1 background='dark'>
                <Flex>
                    <Text3 name={`${strategy.market_id} ${date(trade.open_at_date)}`} value={""}/>
                    { isTrading && <Button label1={"Close"} color="light" style={{"padding": "0.3rem"}} onClick={() => onCloseOrder(trade)} loading={isClosing}/>}
                </Flex>
                <Flex padding={{top: 5, bottom: 5}}>
                    <Text2 name="Side" value={trade.side.toUpperCase()}/>
                    <Text2 name="Open" value={trade.open_price}/>
                    <Text2 name="Moving" value={trade.moving_price}/>
                </Flex>
                <Flex padding={{top: 5, bottom: 5}}>
                    <Text2 name="Position size" value={trade.position_size}/>
                    <Text2 name="Trailing profit" value={trade.trailing_take_profit.toFixed(5)} color="green"/>
                    <Text2 name="Stop loss" value={trade.stop_loss.toFixed(5)} color="red"/>
                </Flex>
                <Flex>
                    <Text2 name="Profit/Loss" value={`${(profit_loss * trade.position_size).toFixed(2)}`} color={profit_loss >= 0 ? "green" : "red"}/>
                    <Text2 name="Difference" value={trailing_take_profit_difference} color="green"/>
                    <Text2 name="Difference" value={stop_loss_difference} color="red"/>
                </Flex>
            </Container1>
        : 
            null
    )
};

interface PropsWaiting {
    trading: ISimulator,
    strategy: IStrategies,
    price_latest: number,
}

const Waiting = ({trading, strategy, price_latest}: PropsWaiting) => {

    const calc_price_difference = (price_snapshot: number, long: number, short: number) => {
        const {strategy: s} = strategy;
        if(s === "counter"){
            return {
                buy: (price_snapshot - long).toFixed(5),
                sell: (price_snapshot + short).toFixed(5),
            }
        }
        if(s === "counter long only"){
            return {
                buy: (price_snapshot - long).toFixed(5),
            }
        }
        if(s === "counter short only"){
            return {
                sell: (price_snapshot + short).toFixed(5),
            }
        }
        if(s === "trend"){
            return {
                buy: (price_snapshot + long).toFixed(5),
                sell: (price_snapshot - short).toFixed(5),
            }
        }
        if(s === "trend long only"){
            return {
                buy: (price_snapshot + long).toFixed(5),
            }
        }
        if(s === "trend short only"){
            return {
                sell: (price_snapshot - short).toFixed(5),
            }
        }
        return {
            buy: "0",
            sell: "0"
        }
    }

    const difference = calc_price_difference(trading.price_snapshot, strategy.long, strategy.short);

    const buy_difference = Math.abs(Number(difference?.buy) - price_latest).toFixed(5);

    const sel_difference = Math.abs(Number(difference?.sell) - price_latest).toFixed(5);

    const side = find_side(strategy.strategy);

    return(
        <Container2>

            <Flex>
                <Text2 name="$Snapshot" value={trading.price_snapshot}/>
                {side === "both" &&
                    <>
                        <Text2 name="$Buy" value={difference?.buy} color="green"/>
                        <Text2 name="$Sell" value={difference?.sell} color="red"/>
                    </>
                }
                {side === "buy" &&
                    <>
                        <Text2 name="$Buy" value={difference?.buy} color="green"/>
                        <Text2 name="Difference" value={buy_difference} color="green"/>
                    </>
                }
                {side === "sell" &&
                    <>
                        <Text2 name="$Sell" value={difference?.sell} color="red"/>
                        <Text2 name="Difference" value={sel_difference}  color="red"/>
                    </>
                }
            </Flex>

            {side === "both" && 
                <Flex padding={{top: 5, bottom: 5}}>
                    <Text2 name="Reset in" value={trading.reset ? timerGreater24(trading.reset) : "not set"} />
                    <Text2 name="Difference" value={buy_difference} color="green"/>
                    <Text2 name="Difference" value={sel_difference}  color="red"/>
                </Flex>
            }

        </Container2>
    )
}

const Trading = () => {

    const {isTrading} = useAppSelector(state => state.trades);

    const {orders, trading, price_latest} = useAppSelector(state => state.trades);

    const {strategy} = useAppSelector(state => state.strategies)

    const check_order_open = (): boolean => {
        const data = orders?.slice(-1)[0];
        if(!data) return false;
        return data.open
    };

    return ( check_order_open() === true 
        ? 
            orders && trading && strategy && <Running orders={orders} isTrading={isTrading} trading={trading} strategy={strategy} price_latest={price_latest} />
        : 
            trading && strategy && <Waiting trading={trading} strategy={strategy} price_latest={price_latest}/>
    )
}

export default Trading