import React, {useEffect, createContext} from 'react';

import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';

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

    const {getQueryValue, location, setQuery} = useQuery();

    const queryValue = getQueryValue("strategy");

    useEffect(() => {
        if(queryValue) {
            dispatch(Strategies.select(queryValue));
            dispatch(Trades.trades(queryValue))
        }
    }, [dispatch, queryValue, location]);

    useEffect(() => {
        if(!queryValue && strategy){
            setQuery("strategy", strategy._id);
        };
    }, [setQuery, strategy, queryValue]);

    useEffect(() => {
        if(strategy) dispatch(Trades.price(strategy));
    }, [dispatch, strategy]);

    useEffect(() => {
        dispatch(Strategies.get());
    }, [dispatch]);

    const value = {

    };
  
    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
};