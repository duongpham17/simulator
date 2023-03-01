import { ISimulatorSimulated } from '@redux/types/simulators';
import useOpen from '@hooks/useOpen';

import { date } from '@utils/functions';

import Text1 from '@components/text/Style1';
import Text2 from '@components/text/Style2';
import Flex from '@components/flex/Flex';
import Element from '@components/element/Style2';
import Pagination from '@components/pagination/Style1';
import Openarrows from '@components/buttons/Openarrows';

interface Props {
    data: ISimulatorSimulated
}

const Orders = ({data}: Props) => {

    const {openItems, onOpenItems, setOpenItems} = useOpen();

    const { orders } = data;

    const onOpenAll = () => {
        if(openItems.length) return setOpenItems([]);
        setOpenItems(data.orders.map(el => el.clientOid))
    }

    return (
        <>
            {!!data.orders.length && <Openarrows onClick={onOpenAll} open={openItems.length >= 1 ? true : false} center />}

            <Pagination data={[...orders].reverse()}>
                {(el) => 
                    <Element key={el.clientOid} pointer onClick={() => onOpenItems(el.clientOid)} selected={openItems.includes(el.clientOid)} style={{"padding": "0.5rem"}}>
                        <Text1 name={<>{el.side.toUpperCase()} &#x2022; {date(el.closed_at_date)}</>} value={el.profit_loss.toFixed(2)} valueColor={el.profit_loss >= 0 ? "green" : "red"} nameColor="default"/>
                        {openItems.includes(el.clientOid) &&
                            <>
                                <Flex>
                                    <Text2 name="Position" value={el.position_size} size={14}/>
                                    <Text2 name="$Open" value={el.open_price} size={14}/>
                                    <Text2 name="$Moving" value={el.moving_price} size={14}/>
                                </Flex>
                                <Flex>
                                    <Text2 name="Leverage" value={`${el.leverage}x`} size={14}/>
                                    <Text2 name="$Close" value={el.close_price} size={14}/>
                                    <Text2 name="Date opened" value={date(el.open_at_date)} size={14}/>
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