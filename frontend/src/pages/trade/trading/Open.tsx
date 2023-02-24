import { useState, useEffect } from 'react';

import { useAppDispatch } from '@redux/hooks/useRedux';
import { IOrders } from '@redux/types/orders';
import { ISimulator } from '@redux/types/simulators';
import { IStrategies } from '@redux/types/strategies';
import Trades from '@redux/actions/trades';

import { date } from '@utils/functions';

import Container from '@components/container/Style1';
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
};

const Open = ({orders, strategy, trading, price_latest, isTrading}: PropsRunning) => {

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

    const take_profit_difference = calc_difference(trade.take_profit, price_latest).toFixed(5)

    const stop_loss_difference = calc_difference(trade.stop_loss, price_latest).toFixed(5)

    return( trade ? 
            <Container background='dark' margin>
                <Flex>
                    <Text3 name={<span> {strategy.market_id} &#x2022; {date(trade.open_at_date)} </span>} value={""}/>
                    { isTrading && <Button label1={"Close"} color="light" style={{"padding": "0.3rem"}} onClick={() => onCloseOrder(trade)} loading={isClosing}/>}
                </Flex>
                <Flex>
                    <Text3 name={<span> {strategy.strategy} &#x2022; {strategy.trailing_take_profit ? "trailing" : "take"} </span>} value={""}/>
                </Flex>
                <Flex padding={{top: 5, bottom: 5}}>
                    <Text2 name="Side" value={trade.side.toUpperCase()}/>
                    <Text2 name="Open" value={trade.open_price}/>
                    <Text2 name="Moving" value={trade.moving_price}/>
                </Flex>
                <Flex padding={{top: 5, bottom: 5}}>
                    <Text2 name="Position size" value={trade.position_size}/>
                    <Text2 name="Take profit" value={trade.take_profit.toFixed(5)} color="green"/>
                    <Text2 name="Stop loss" value={trade.stop_loss.toFixed(5)} color="red"/>
                </Flex>
                <Flex>
                    <Text2 name="Profit/Loss" value={`${(profit_loss * trade.position_size).toFixed(2)}`} color={profit_loss >= 0 ? "green" : "red"}/>
                    <Text2 name="Difference" value={take_profit_difference} color="green"/>
                    <Text2 name="Difference" value={stop_loss_difference} color="red"/>
                </Flex>
            </Container>
        : 
            null
    )
};

export default Open