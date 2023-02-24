import { ACTION_STRATEGIES, TYPES_STRATEGIES, INITIALSTATE_STRATEGIES } from '@redux/types/strategies';

const initialState: INITIALSTATE_STRATEGIES = {
    strategies: null,
    strategy: null,
    status: {},
    errors: {},
};

export const trading = (state = initialState, action: ACTION_STRATEGIES) => {
    const {type, payload} = action;

    switch(type){
        case TYPES_STRATEGIES.STRATEGIES:
            return{
                ...state,
                strategies: payload
            };
        case TYPES_STRATEGIES.STRATEGIES_BUILD:
            return{
                ...state,
                strategies: !state.strategies ? [payload] : [payload, ...state.strategies]
            };
        case TYPES_STRATEGIES.STRATEGIES_UPDATE:
            return{
                ...state,
                strategies: !state.strategies ? [payload] : state.strategies.map(el => el._id === payload._id ? payload : el),
                strategy: state.strategy ? payload._id === state.strategy._id ? payload : state.strategy : payload
            };
        case TYPES_STRATEGIES.STRATEGIES_DUPLICATE:
            return{
                ...state,
                strategies: !state.strategies ? [payload] : [payload, ...state.strategies]
            }
        case TYPES_STRATEGIES.STRATEGIES_STRATEGY:
            return{
                ...state,
                strategy: payload
            }
        case TYPES_STRATEGIES.STRATEGIES_REMOVE:
            return{
                ...state,
                strategies: state.strategies?.filter(el => el._id !== payload) || []
            }
        case TYPES_STRATEGIES.STRATEGIES_RESPONSE_STATUS:
            return{
                ...state,
                status: payload
            };
        case TYPES_STRATEGIES.STRATEGIES_RESPONSE_ERROR:
            return{
                ...state,
                errors: payload
            };
        case TYPES_STRATEGIES.STRATEGIES_RESPONSE_CLEAR:
            return{
                ...state,
                status: {},
                errors: {}
            };
        case TYPES_STRATEGIES.STRATEGIES_STATE_CLEAR:
            return{
                ...state,
                [payload.key]: payload.value
            }

        default: 
            return state;
    }
}

export default trading;