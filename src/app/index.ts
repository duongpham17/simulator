import express from 'express';
import server from './server';
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

    server(app, express);

    port(app);
    
};