import { api } from '@redux/api';
import { Dispatch } from 'redux';
import { ACTION_USER, TYPES_USER, IUser } from '@redux/types/user';

const update = (data: IUser) => async (dispatch: Dispatch<ACTION_USER>) => {
    try{
        const res = await api.patch(`/users`, data);
        dispatch({
            type: TYPES_USER.USER,
            payload: res.data.data
        });
    } catch (error: any) {
        console.log("Please reload")
    }
};

const User = {
    update
};

export default User;