import React, {createContext, useEffect, useState} from 'react';

import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { localGet } from '@utils/localstorage';

import Orders from '@redux/actions/orders';
import useQuery from '@hooks/useQuery';
import { IOrders } from '@redux/types/orders';

export interface PropsTypes {
    initialOrders: IOrders[] | null,
    orders: IOrders[] | null,
    setOrders: React.Dispatch<React.SetStateAction<IOrders[] | null>>
};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({
    initialOrders: null,
    orders: null,
    setOrders: () => null 
});

// Provider in your app
export const UseOrdersContext = ({children}: {children: React.ReactNode}) => {

    const {orders: initialOrders} = useAppSelector(state => state.orders);

    const [orders, setOrders] = useState<IOrders[] | null>(initialOrders)

    const dispatch = useAppDispatch();

    const {getQueryValue, setQuery} = useQuery();

    const queryValue = getQueryValue("environment");

    const localValue = JSON.parse(localGet("orders-environment"));

    useEffect(() => {
        if(!queryValue) setQuery('environment', queryValue || localValue);
    }, [queryValue, setQuery, localValue]);

    useEffect(() => {
        dispatch(Orders.orders(queryValue || localValue))
    }, [dispatch, queryValue, localValue]);

    useEffect(() => {
        setOrders(initialOrders)
    }, [initialOrders])

    const value = {
        initialOrders,
        orders,
        setOrders,
    }

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
};