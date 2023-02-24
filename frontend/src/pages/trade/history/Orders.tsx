import { IOrders } from '@redux/types/orders';

import useOpen from '@hooks/useOpen';

import { date } from '@utils/functions';

import Element from '@components/element/Style2';
import Text1 from '@components/text/Style1';
import Text2 from '@components/text/Style2';
import Text3 from '@components/text/Style3';
import Flex from '@components/flex/Flex';
import Pagination from '@components/pagination/Style1';
import Line from '@components/line/Style1';
import Openarrows from '@components/buttons/Openarrows';

interface Props {
    orders: IOrders[],
}

const Orders = ({orders}: Props) => {

    const {openItems, onOpenItems, setOpenItems} = useOpen();

    const onOpenAll = () => {
        if(openItems.length) return setOpenItems([]);
        setOpenItems([...orders.map(el=> el._id)]);
    };

    return (
        <>  
            {!!orders.length && <Openarrows onClick={onOpenAll} open={openItems.length > 0 ? true : false} center />}

            <Pagination data={[...orders].reverse().filter(el => el.open !== true)}>
                {(el) => 
                    <Element key={el._id} onClick={() => onOpenItems(el._id)} selected={openItems.includes(el._id)} style={{"padding": "0.5rem"}} >
                        <Text1 name={<>{el.side.toUpperCase()} &#x2022; { el.market_id.toLowerCase()} &#x2022; {el.closed}</>} nameColor="default" value={el.profit_loss.toFixed(2)} valueColor={el.profit_loss >= 0 ? "green" : "red"}/>
                        <Text3 color='light' name={el.strategy.strategy} value={`${date(el.closed_at_date)}`} size={14} />
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
                                <Line />
                                <Flex padding={{top: 4, bottom: 4}}>
                                    <Text2 name="Reset" value={el.strategy.reset > 0 ? el.strategy.reset : "off"} size={14} />
                                    <Text2 name="Long" value={el.strategy.long} size={14} />
                                    <Text2 name="Short" value={el.strategy.short} size={14} />
                                </Flex>
                                <Flex>
                                    <Text2 name="Trailing" value={el.strategy.trailing_take_profit ? "on" : "off"} size={14} />
                                    <Text2 name="Take profit" value={el.strategy.take_profit} size={14} />
                                    <Text2 name="Stop loss" value={el.strategy.stop_loss} size={14} />
                                </Flex>
                            </>
                        }
                    </Element>
                }
            </Pagination>
        </>
    )
}

export default Orders