import express from 'express';
import database from './database';
import parser from './parser';
import port from './port';
import routes from './routes';
import security from './security';

const app = express();

export default (): void => {

    security(app);

    parser(app, express);

    routes(app);

    database();

    port(app);
    
};