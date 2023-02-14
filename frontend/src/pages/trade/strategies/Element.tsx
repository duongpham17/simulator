import React from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { IStrategiesCustomInputs } from '@redux/types/strategies';
import Strategies from '@redux/actions/strategies';

import Button from '@components/buttons/Button';
import Icon from '@components/buttons/Icon';
import Summary from '@components/summary/Style1';
import Menu from '@components/menu/Menu';
import Text from '@components/text/Style1';
import Line from '@components/line/Style1';

import {MdPlayArrow, MdSettings} from 'react-icons/md';

interface Props {
    strategy: IStrategiesCustomInputs,
    query_strategy_id: string | null,
    setQuery: (params: string, value: string | number) => string,
};

const Edit = ({strategy, query_strategy_id, setQuery}:Props) => {

    const {isTrading} = useAppSelector(state => state.trades);

    const dispatch = useAppDispatch();

    const onQuickRun = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        if(query_strategy_id === strategy._id) return;
        setQuery("strategy", strategy._id as string);
        if(isTrading) return;
        dispatch(Strategies.reorder(strategy));
    };

    const Dropdown = ({data}:{data: IStrategiesCustomInputs}) => {
        const style = {padding: "0.2rem", margin: "0.2rem 0"};
        return (
            <div>
                <Button label1="duplicate" style={style} color="dark" onClick={() => dispatch(Strategies.duplicate(data))} />
                <Button label1="delete" style={style} color="red" onClick={() => dispatch(Strategies.remove(data._id || ""))} />
            </div>
        );
    };

    return (
        <Summary title={strategy.new ? `new | ${strategy.name}` : strategy.name} 
            iconClose={!isTrading ? <Icon icon={<MdPlayArrow/>} onClick={onQuickRun} /> : <></> } 
            iconOpen={!isTrading || query_strategy_id !== strategy._id ? <Menu icon={<MdSettings/>}><Dropdown data={strategy}/></Menu> : ""}
            selected={query_strategy_id === strategy._id}
        >
            <>

                <Text name="Market id" value={strategy.market_id.toLowerCase()} />
                <Text name="Exchange" value={strategy.exchange} />
                <Text name="Strategy" value={strategy.strategy} />

                <Line/>

                <Text name="Long" value={strategy.long} />
                <Text name="Short" value={strategy.short} />

                <Line/>
                <Text name="Take profit" value={strategy.take_profit} />
                <Text name="Stop loss" value={strategy.stop_loss} />

                <Line/>

                <Text name="Trailing take profit" value={strategy.trailing_take_profit.toString()} />

                {!isTrading && <Line/>}

                {!isTrading && <Button label1="Select" onClick={onQuickRun} label2={<MdPlayArrow/>} color="blue" />}
                    
            </>

        </Summary>
    )
}

export default Edit