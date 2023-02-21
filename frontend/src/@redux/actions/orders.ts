import { api } from '@redux/api';
import { Dispatch } from 'redux';
import { ACTION_ORDERS, TYPES_ORDERS } from '@redux/types/orders';

const orders = (environment: string) => async (dispatch: Dispatch<ACTION_ORDERS>) => {
    try{
        const res = await api.get(`/orders/${environment}`);
        dispatch({
            type: TYPES_ORDERS.ORDERS,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log(error.response)
    }
}

const Orders = {
    orders,
};

export default Orders;