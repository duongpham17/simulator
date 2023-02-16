import {Express} from 'express';

import authentication from './authentication';
import strategies from './strategies';
import simulators from './simulators';
import trades from './trades';
import orders from './orders';

const endpoints = (app: Express) => {
    app.use('/api/authentication', authentication);
    app.use('/api/strategies', strategies);
    app.use('/api/simulators', simulators);
    app.use('/api/trades', trades);
    app.use('/api/orders', orders);
}

export default endpoints