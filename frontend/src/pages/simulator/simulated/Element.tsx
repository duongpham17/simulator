import { useAppDispatch } from '@redux/hooks/useRedux';
import { ISimulatorSimulated } from '@redux/types/simulators';
import Alert from '@redux/actions/alert';
import Strategies from '@redux/actions/strategies';
import Simulator from '@redux/actions/simulators';
import useOpen from '@hooks/useOpen';
import useLoading from '@hooks/useLoading';

import { date } from '@utils/functions';

import Text1 from '@components/text/Style1';
import Text2 from '@components/text/Style2';
import Text3 from '@components/text/Style3';
import Flex from '@components/flex/Flex';
import Summary from '@components/summary/Style1';
import Element from '@components/element/Style2';
import Line from '@components/line/Style1';
import Button from '@components/buttons/Button';
import Pagination from '@components/pagination/Style1';

interface Props {
    data: ISimulatorSimulated
}

const ElementContainer = ({data}: Props) => {

    const {strategy, orders, simulator} = data;

    const dispatch = useAppDispatch();

    const {openItems, onOpenItems} = useOpen();

    const {loading: saveLoading, onLoading: onLoadingSave} = useLoading();

    const profit_loss = orders.reduce((acc, obj) => {
        const calc = obj.profit_loss >= 0 ? 'profit' : "loss";
        return {...acc, [calc]: acc[calc] + obj.profit_loss};
    }, {
        profit: 0,
        loss: 0
    });

    const win_rate = () => {
        const d = orders.reduce((acc, obj) => {
            const calc = obj.profit_loss >= 0 ? "win" : "lose";
            return {...acc, [calc]: acc[calc] + 1};
        }, {
            win: 0,
            lose: 0
        });
        const win_percentage = ((d.win / orders.length) * 100).toFixed(2);
        return win_percentage;
    };

    const onSave = async () => {
        const d = {
            ...strategy,
            _id: undefined,
            name: `new | ${strategy.name} ${strategy.strategy}`,
        }
        onLoadingSave(() => dispatch(Strategies.build(d)));
        dispatch(Alert.set("Strategy saved", "green"));
    }

    const onDelete = () => {
        dispatch(Simulator.simulate_remove(simulator.createdAt.toLocaleString()))
    }

    return (
        <Summary 
            background='dark'
            title={<>{strategy.strategy} &#x2022; {simulator.live ? "live" : "test"} &#x2022; {strategy.trailing_take_profit ? "trailing" : "take"}</>} 
            small={<Text3 name={simulator.market_id.toLowerCase()} value={date(simulator.createdAt)} color="light"/>} 
            section={
                <>
                    <Flex center>
                        <Text2 name="Long" value={strategy.long} />
                        <Text2 name="Short" value={strategy.short}/>
                        <Text2 name="Take profit" value={strategy.take_profit}/>
                        <Text2 name="Stop Loss" value={strategy.stop_loss}/>
                    </Flex>
                    <Line />
                    <Flex center>
                        <Text2 name="Trades" value={orders.length} />
                        <Text2 name="% Win" value={win_rate()}/>
                        <Text2 name="Profit" value={profit_loss.profit.toFixed(2)} color="green"/>
                        <Text2 name="Loss" value={profit_loss.loss.toFixed(2)} color="red"/>
                    </Flex>
                </>
            }
        > 

        <Line />
        
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

        <Flex>
            <Button label1="save" color="light" onClick={onSave} loading={saveLoading} style={{"width": "100px", "padding": "0.3rem"}}/>
            <Button label1="delete" color="light" onClick={onDelete} style={{"width": "100px", "padding": "0.3rem"}}/>
        </Flex>

        </Summary>
    )
}

export default ElementContainer