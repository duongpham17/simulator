import { ACTION_USER, TYPES_USER, INITIALSTATE_USER } from '@redux/types/user';

const initialState: INITIALSTATE_USER = {
    user: null,
    status: {},
    errors: {},
};

export const user = (state = initialState, action: ACTION_USER) => {
    const {type, payload} = action;

    switch(type){
        case TYPES_USER.USER:
            return{
                ...state,
                user: payload
            }  
        case TYPES_USER.RESPONSE_STATUS:
            return{
                ...state,
                status: payload
            };
        case TYPES_USER.RESPONSE_ERROR:
            return{
                ...state,
                errors: payload
            }
        case TYPES_USER.RESPONSE_CLEAR:
            return{
                ...state,
                status: {},
                errors: {}
            }

        default: 
            return state;
    }
}

export default user;