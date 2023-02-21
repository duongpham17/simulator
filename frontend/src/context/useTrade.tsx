import React, {useEffect, createContext} from 'react';

import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';

import {localGet} from '@utils/localstorage';

import Strategies from '@redux/actions/strategies';
import Trades from '@redux/actions/trades';
import useQuery from '@hooks/useQuery';

export interface PropsTypes {

}

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({

});

// Provider in your app
export const UseTradeContext = ({children}: {children: React.ReactNode}) => {

    const dispatch = useAppDispatch();

    const {strategy} = useAppSelector(state => state.strategies);

    const {getQueryValue, setQuery} = useQuery();

    const queryValue = getQueryValue("strategy");

    const localValue = JSON.parse(localGet("strategy-id"));

    useEffect(() => {
        if(!queryValue && !localValue) return;
        dispatch(Strategies.select(queryValue || localValue));
        dispatch(Trades.trades(queryValue || localValue));
    }, [dispatch, queryValue, localValue]);

    useEffect(() => {
        if(!queryValue && localValue) setQuery("strategy", localValue);
    }, [setQuery, queryValue, localValue]);

    useEffect(() => {
        if(strategy) dispatch(Trades.price(strategy));
    }, [dispatch, strategy]);

    useEffect(() => {
        dispatch(Strategies.get());
        dispatch(Strategies.state_clear("status", {}));
    }, [dispatch]);

    const value = {

    };
  
    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
};