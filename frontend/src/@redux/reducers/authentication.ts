import { ACTION_AUTHENTICATION, TYPES_AUTHENTICATION, INITIALSTATE_AUTHENTICATION} from '@redux/types/authentication';

const initialState: INITIALSTATE_AUTHENTICATION = {
    isLoggedIn: false,
    status: {},
    errors: {}
};

export const authentication = (state = initialState, action: ACTION_AUTHENTICATION) => {
    const {type, payload} = action;

    switch(type){
        case TYPES_AUTHENTICATION.AUTHENTICATION_LOAD_USER:
            return{
                ...state,
                isLoggedIn: payload
            }
        case TYPES_AUTHENTICATION.AUTHENTICATION_RESPONSE_STATUS:
            return{
                ...state,
                status: payload
            }
        case TYPES_AUTHENTICATION.AUTHENTICATION_RESPONSE_ERROR:
            return{
                ...state,
                errors: payload,
            }
        case TYPES_AUTHENTICATION.AUTHENTICATION_RESPONSE_CLEAR:
            return{
                ...state,
                status: {},
                errors: {}
            }
        case TYPES_AUTHENTICATION.AUTHENTICATION_STATE_CLEAR:
            return{
                ...state,
                [payload.key]: payload.value
            }

        default: 
            return state;
    }
}

export default authentication;