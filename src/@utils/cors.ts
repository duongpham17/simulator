import cors from 'cors';

// whitelisted website only
export const corsPrivate = (() => {

    const productionURL: string[] = [`${process.env.WEBSITE_URL}`];

    const developmentURL: string[] = ['http://localhost:3000'];

    const whitelist: string[] = process.env.NODE_ENV === "development" ? developmentURL : productionURL;

    return cors({
        origin: whitelist,
        methods: ['GET','POST','DELETE','PUT','PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept'],
    });
})();

// Public use only
export const corsPublic = (() => {
    return cors({
        origin: "*",
        methods: ['GET'],
    });
})();