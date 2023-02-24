import { useContext } from 'react';
import { IOrders } from '@redux/types/orders';
import { Context } from 'context/useOrders';

import useOpen from '@hooks/useOpen';

import {date, firstcaps} from '@utils/functions';

import Pagination from '@components/pagination/Style1';
import Element from '@components/element/Style2';
import Text1 from '@components/text/Style1';
import Text2 from '@components/text/Style2';
import Text3 from '@components/text/Style3';
import Flex from '@components/flex/Flex';

const Index = () => {
    const {orders} = useContext(Context)
    return ( orders && <Test orders={orders}/> )
};

interface Props {
    orders: IOrders[]
};

const Test = ({orders}: Props) => {

    const {openItems, onOpenItems} = useOpen();

    return (
        <Pagination data={[...orders].reverse().filter(el => el.open !== true)} show={20} top>
            {(el) => 
                <Element key={el._id} onClick={() => onOpenItems(el._id)} selected={openItems.includes(el._id)} style={{"padding": "0.5rem"}}>
                    <Text1 name={<>{firstcaps(el.side)} &#x2022; {el.market_id.toLowerCase()} </>} nameColor="default" value={el.profit_loss.toFixed(2)} valueColor={el.profit_loss >= 0 ? "green" : "red"}/>
                    <Text3 color='light' name={<span>{el.strategy.strategy} &#x2022; {el.closed} &#x2022; {el.strategy.trailing_take_profit ? "trailing" : "take"}</span>} value={`${date(el.closed_at_date)}`} size={14} />
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

export default Index