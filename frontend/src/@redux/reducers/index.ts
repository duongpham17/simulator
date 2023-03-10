import { combineReducers } from '@reduxjs/toolkit';

import alert from './alert';
import authentication from './authentication';
import user from './user';
import strategies from './strategies';
import simulators from './simulators';
import trades from './trades';
import orders from './orders';

const reducers = combineReducers({
    alert,
    authentication,
    user,
    strategies,
    simulators,
    trades,
    orders
});

export default reducers;