import {Express} from 'express';
import path from 'path';

const heroku = (app: Express, express: any) => {
    const production = process.env.NODE_ENV === "production";

    if(production){

        app.use(express.static(path.join(__dirname, '../../frontend/build')));

        app.get('*', (req, res) => {
            res.sendFile('index.html', {root: path.join(__dirname, '../../frontend', 'build')});
        });
    };
    
}

export default heroku;