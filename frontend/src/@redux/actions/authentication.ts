import { Dispatch } from 'redux';
import { ACTION_AUTHENTICATION, AuthenticationObjectKeys, TYPES_AUTHENTICATION } from '@redux/types/authentication';
import { ACTION_USER, TYPES_USER } from '@redux/types/user';
import { api } from '@redux/api';
import { redirect } from '@utils/functions';
import { localSet } from '@utils/localstorage';

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("strategies.running")
    redirect();
};

const load_user = () => async (dispatch: Dispatch<ACTION_AUTHENTICATION | ACTION_USER>) => {
    try{
        const res = await api.get('/authentication/persist');
        dispatch({
            type: TYPES_AUTHENTICATION.AUTHENTICATION_LOAD_USER,
            payload: true
        });
        dispatch({
            type: TYPES_USER.USER,
            payload: res.data.data
        });
    } catch(err){
        // logout()
    }
};
    
const login = (email: string) => async (dispatch: Dispatch<ACTION_AUTHENTICATION>) => {
    try{
        const res = await api.post(`/authentication/email`, {email});
        dispatch({
            type: TYPES_AUTHENTICATION.AUTHENTICATION_RESPONSE_STATUS,
            payload: {
                login: res.data.status
            }
        });
    } catch(error:any){
        dispatch({
            type: TYPES_AUTHENTICATION.AUTHENTICATION_RESPONSE_ERROR,
            payload: {
                login: error.response.data.message
            }
        });
    }
};

const confirm_with_email = (token: string) => async (dispatch: Dispatch<ACTION_AUTHENTICATION>) => {
    try{
        const res = await api.get(`/authentication/authenticate/${token}`);
        localSet("user", res.data.cookie);
        redirect();
    } catch(error:any){
        dispatch({
            type: TYPES_AUTHENTICATION.AUTHENTICATION_RESPONSE_ERROR,
            payload: {
                confirm: error.response.data.message
            }
        })
    }
};

const confirm_with_code = (email: string, code: string) => async (dispatch: Dispatch<ACTION_AUTHENTICATION>) => {
    try{
        const res = await api.post(`/authentication/authenticate`, {email, code});
        localSet("user", res.data.cookie);
        redirect();
    } catch(error:any){
        dispatch({
            type: TYPES_AUTHENTICATION.AUTHENTICATION_RESPONSE_ERROR,
            payload: {
                code:  error.response.data.message
            }
        })
    }
};

const state_clear = (key:AuthenticationObjectKeys, value: any) => async (dispatch: Dispatch<ACTION_AUTHENTICATION>) => {
    dispatch({
        type: TYPES_AUTHENTICATION.AUTHENTICATION_STATE_CLEAR,
        payload: { key, value }
    });
};


const Authentication = {
    load_user,
    login,
    logout,
    confirm_with_code,
    confirm_with_email,
    state_clear
};

export default Authentication