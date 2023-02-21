import { ACTION_ORDERS, TYPES_ORDERS, INITIALSTATE_ORDERS } from '@redux/types/orders';

const initialState: INITIALSTATE_ORDERS = {
    orders: null
};

export const orders = (state = initialState, action: ACTION_ORDERS) => {
    const {type, payload} = action;

    switch(type){
        case TYPES_ORDERS.ORDERS:
            return{
                ...state,
                orders: payload
            }  

        default: 
            return state;
    }
}

export default orders;