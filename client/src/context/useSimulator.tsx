import React, {useEffect, createContext} from 'react';

import useFetch from '@redux/hooks/useFetch';

import Simulator from '@redux/actions/simulators';
import useQuery from '@hooks/useQuery';

export interface PropsTypes {

}

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({

});

// Provider in your app
export const UseSimulatorContext = ({children}: {children: React.ReactNode}) => {

    const {dispatch} = useFetch(Simulator.simulators());
 
    const {getQueryValue, location} = useQuery();

    const queryValue = getQueryValue("simulator");

    useEffect(() => {
        if(queryValue) dispatch(Simulator.simulator(queryValue));
    }, [dispatch, location, queryValue]);

    const value = {
        dispatch
    };
  
    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
};