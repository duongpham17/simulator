import { ACTION_SIMULATORS, TYPES_SIMULATORS, INITIALSTATE_SIMULATOR} from '@redux/types/simulators';

const initialState: INITIALSTATE_SIMULATOR = {
    simulators: null,
    simulator: null,
    simulated: null,
};

export const simulators = (state = initialState, action: ACTION_SIMULATORS) => {
    const {type, payload} = action;

    switch(type){
        case TYPES_SIMULATORS.SIMULATORS:
            return{
                ...state,
                simulators: payload
            };
        case TYPES_SIMULATORS.SIMULATORS_SIMULATOR:
            return{
                ...state,
                simulator: payload,
            };
        case TYPES_SIMULATORS.SIMULATORS_SIMULATOR_REMOVE:
            return{
                ...state,
                simulators: state.simulators ? state.simulators.filter(el => el._id !== payload) : []
            };
        case TYPES_SIMULATORS.SIMULATORS_SIMULATE:
            return{
                ...state,
                simulated: state.simulated ? [payload, ...state.simulated] : [payload],
            };
        case TYPES_SIMULATORS.SIMULATORS_SIMULATE_REMOVE:
            return{
                ...state,
                simulated: state.simulated ? state.simulated.filter(el => el.createdAt.toLocaleString() !== payload) : []
            };

        case TYPES_SIMULATORS.SIMULATORS_CLEAR:
            return{
                ...state,
                [payload.key]: payload.value
            }
        default: 
            return state;
    }
}

export default simulators;