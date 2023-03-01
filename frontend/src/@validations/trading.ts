export interface Validation {
    name: string,

    api_key: string,
    secret_key: string,
    passphrase: string, 
    exchange: string,
    market_id: string,

    strategy: string,
    short: number | string,
    long: number | string,
    stop_loss: number | string,
    take_profit: number | string,

    leverage: string,
    position_size: string,
    usdt_balance: string,
};

const check = (key: any, values: any) => key in values;

const exchange = (values: Validation) => {
    let errors: Partial<Validation> = {};

    if(check("exchange", values)){
        if(!values.exchange) {
            errors.exchange = "*";
        }
    } 
    if(check("api_key", values)){
        if(!values.api_key) {
            errors.api_key = "*";
        }
    } 
    if(check("secret_key", values)){
        if(!values.secret_key) {
            errors.secret_key = "*";
        }
    } 
    if(check("passphrase", values)){
        if(!values.passphrase) {
            errors.passphrase = "*";
        }
    } 
    if(check("market_id", values)){
        if(!values.market_id) {
            errors.market_id = "*";
        }
    } 
    return errors
}

const strategy = (values: Validation) => {
    let errors: Partial<Validation> = {};

    if(check("strategy", values)){
        if(!values.strategy) {
            errors.strategy = "*";
        }
    } 

    return errors
}

const position = (values: Validation) => {
    let errors: Partial<Validation> = {};

    if(check("leverage", values)){
        if(!values.leverage) {
            errors.leverage = "*";
        }
        if(Number(values.leverage) > 30 || Number(values.leverage) < 0){
            errors.leverage = "1 - 30";
        }
    } 
    if(check("usdt_balance", values)){
        if(!values.usdt_balance) {
            errors.usdt_balance = "*"
        }
    }
    if(check("position_size", values)){
        if(!values.position_size) {
            errors.position_size = "*"
        }
    }

    return errors
}

const general = (values: Validation) => {
    let errors: Partial<Validation> = {};

    if(check("name", values)){
        if(!values.name) {
            errors.name = "*";
        }
    } 

    return errors
}

const marketId = (values: Validation) => {
    let errors: Partial<Validation> = {};

    if(check("market_id", values)){
        if(!values.market_id) {
            errors.market_id = "*";
        }
    } 

    return errors
}


export const validations = {
    marketId,
    exchange,
    strategy,
    position,
    general,
}

export default validations