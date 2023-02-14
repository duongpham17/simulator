import { IStrategies } from '@redux/types/strategies';
import { IOrders } from '@redux/types/trades';
import { useAppSelector } from '@redux/hooks/useRedux';

import useOpen from '@hooks/useOpen';

import { date } from '@utils/functions';

import Element from '@components/element/Style2';
import Text1 from '@components/text/Style1';
import Text2 from '@components/text/Style2';
import Text3 from '@components/text/Style3';
import Flex from '@components/flex/Flex';
import Container from '@components/container/Style1';
import Pagination from '@components/pagination/Style1';

interface Props {
    orders: IOrders[],
    strategy: IStrategies
}

const Summary = ({orders}: {orders: IOrders[]}) => {

    const win_rate = () => {
        const data = orders.reduce((acc, obj) => {
            const calc = obj.profit_loss >= 0 ? "win" : "lose";
            return {...acc, [calc]: acc[calc] + 1};
        }, {
            win: 0,
            lose: 0
        });
        const win_percentage = ((data.win / orders.length) * 100).toFixed(2);
        return win_percentage === "NaN" ? 0 : win_percentage
    }

    const profit_loss = orders.reduce((acc, obj) => {
        const calc = obj.profit_loss >= 0 ? 'profit' : "loss";
        return {...acc, [calc]: acc[calc] + obj.profit_loss};
    }, {
        profit: 0,
        loss: 0
    });

    return (
        <Container noBorder>
            <Flex center>
                <Text2 name="Trades" value={orders.filter(el => el.open === false).length} />
                <Text2 name="Win %" value={win_rate() || 0} />
                <Text2 name="Profit" value={profit_loss.profit.toFixed(2)} color="green" />
                <Text2 name="Loss" value={profit_loss.loss.toFixed(2)} color="red" />
            </Flex>
        </Container>
    )
};

const Orders = ({orders, strategy}: Props) => {

    const {openItems, onOpenItems} = useOpen();

    return (
        <Pagination data={[...orders].reverse().filter(el => el.open !== true)}>
            {(el) => 
                <Element key={el._id} onClick={() => onOpenItems(el._id)} selected={openItems.includes(el._id)} style={{"padding": "0.5rem"}}>
                    <Text1 name={<span>{el.side.toUpperCase()} &#x2022; { strategy.market_id.toLowerCase()} &#x2022; {el.closed} &#x2022; {el.trailing_take_profit ? "trailing" : "take"}</span>} nameColor="default" value={el.profit_loss.toFixed(2)} valueColor={el.profit_loss >= 0 ? "green" : "red"}/>
                    <Text3 color='light' name={el.strategy} value={`${date(el.closed_at_date)}`} size={14} />
                    {openItems.includes(el._id) &&
                        <>
                            <Flex padding={{top: 4, bottom: 4}}>
                                <Text2 name="$Open" value={el.open_price} size={14} />
                                <Text2 name="$Moving" value={el.moving_price} size={14} />
                                <Text2 name="$Close" value={el.close_price} size={14} />
                            </Flex>
                            <Flex>
                                <Text2 name="Position size" value={el.position_size} size={14} />
                                <Text2 name="Leverage" value={`${el.leverage}x`} size={14} />
                                <Text2 name="Date opened" value={date(el.open_at_date)} size={14} />
                            </Flex>
                        </>
                    }
                </Element>
            }
        </Pagination>
    )
}

const History = () => {
    
    const {strategy} = useAppSelector(state => state.strategies);

    const {orders} = useAppSelector(state => state.trades);
    
    return (  (orders && strategy)
        ?  
            <>              
                <Summary orders={orders} />

                <Orders  orders={orders} strategy={strategy}/>
            </>      
        : 
            null
    )
}

export default History