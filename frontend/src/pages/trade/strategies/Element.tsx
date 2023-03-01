import React from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { IStrategiesCustomInputs } from '@redux/types/strategies';
import Strategies from '@redux/actions/strategies';
import Trades from '@redux/actions/trades';

import Button from '@components/buttons/Button';
import Favourite from '@components/buttons/Favourite';
import Summary from '@components/summary/Style1';
import Menu from '@components/menu/Menu';
import Text from '@components/text/Style1';
import Line from '@components/line/Style1';

import { MdPlayArrow, MdSettings, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { localSet } from '@utils/localstorage';

interface Props {
    strategy: IStrategiesCustomInputs,
    query_strategy_id: string | null,
    setQuery: (params: string, value: string | number) => string,
};

const Edit = ({strategy, query_strategy_id, setQuery}:Props) => {

    const {isTrading} = useAppSelector(state => state.trades);

    const dispatch = useAppDispatch();

    const onQuickRun = () => {
        if(query_strategy_id === strategy._id) return;
        dispatch(Trades.reset());
        setQuery("strategy", strategy._id as string);
        localSet("strategy-id", strategy._id as string)
    };

    const onFavourite = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        dispatch(Strategies.update({...strategy, favourite: !strategy.favourite}))
    }

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
            iconClose={!isTrading ? <Favourite selected={strategy.favourite} onClick={onFavourite}/> : query_strategy_id === strategy._id ? <MdOutlineKeyboardArrowRight/> : <Favourite selected={strategy.favourite} onClick={onFavourite}/> } 
            iconOpen={!isTrading || query_strategy_id !== strategy._id ? <Menu icon={<MdSettings/>}><Dropdown data={strategy}/></Menu> : <MdOutlineKeyboardArrowRight/>}
            selected={query_strategy_id === strategy._id}
            background="dark"
        >
            <>
                <Line/>
                
                <Text name="Environment" value={strategy.live ? "live" : "test"} />
                <Text name="Market id" value={strategy.market_id.toLowerCase()} />
                <Text name="Exchange" value={strategy.exchange} />
                <Text name="Strategy" value={strategy.strategy} />

                <Line/>

                <Text name="Usdt Balance" value={`$${strategy.usdt_balance}`} />
                <Text name="Leverage" value={`${strategy.leverage}x`} />
                <Text name="Position size" value={strategy.position_size} />

                <Line/>

                <Text name="Long" value={strategy.long} />
                <Text name="Short" value={strategy.short} />
                <Text name="Take profit" value={strategy.take_profit} />
                <Text name="Stop loss" value={strategy.stop_loss} />
                <Text name="Reset" value={strategy.reset > 0 ? `${strategy.reset} minute` : "off"} />
                <Text name="Trailing take profit" value={strategy.trailing_take_profit ? "on" : "off"} />

                {(!isTrading && query_strategy_id !== strategy._id) && <Line/>}

                {(!isTrading && query_strategy_id !== strategy._id) && <Button label1="Select" onClick={onQuickRun} label2={<MdPlayArrow/>} color="blue" />}
                    
            </>

        </Summary>
    )
}

export default Edit