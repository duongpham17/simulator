import React, {useEffect, createContext} from 'react';

import Simulator from '@redux/actions/simulators';
import useFetch from '@redux/hooks/useFetch';
import useQuery from '@hooks/useQuery';

import {localGet} from '@utils/localstorage';

export interface PropsTypes {

}

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({

});

// Provider in your app
export const UseSimulatorContext = ({children}: {children: React.ReactNode}) => {

    const {dispatch} = useFetch(Simulator.simulators());
 
    const {getQueryValue, setQuery} = useQuery();

    const queryValue = getQueryValue("simulator");

    const localValue = JSON.parse(localGet("simulator-id"));

    useEffect(() => {
        if(queryValue && localValue) dispatch(Simulator.simulator(queryValue || localValue));
    }, [dispatch, queryValue, localValue]);

    useEffect(() => {
        if(!queryValue && localValue) setQuery("simulator", queryValue|| localValue);
    }, [setQuery, queryValue, localValue]);

    const value = {}

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
};