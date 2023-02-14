export interface Validation {
    name: string,
    strategy: string, 
    market_id: string,
    leverage: string,
    position_size: string,
    api_key: string,
    secret_key: string,
    passphrase: string, 
    exchange: string,
    usdt_balance: string,
}

export const validation = (values: Validation) => {
    let errors: Partial<Validation> = {};

    const check = (key: any) => key in values;

    if(check("exchange")){
        if(!values.exchange) {
            errors.exchange = "*";
        }
    } 

    if(check("api_key")){
        if(!values.api_key) {
            errors.api_key = "*";
        }
    } 
    if(check("secret_key")){
        if(!values.secret_key) {
            errors.secret_key = "*";
        }
    } 
    if(check("passphrase")){
        if(!values.passphrase) {
            errors.passphrase = "*";
        }
    } 
    if(check("name")){
        if(!values.name) {
            errors.name = "*";
        }
    } 
    if(check("market_id")){
        if(!values.market_id) {
            errors.market_id = "*";
        }
    } 
    if(check("leverage")){
        if(!values.leverage) {
            errors.leverage = "*";
        }
        if(Number(values.leverage) > 30 || Number(values.leverage) < 0){
            errors.leverage = "1 - 30";
        }
    } 
    if(check("strategy")){
        if(!values.strategy) {
            errors.strategy = "*";
        }
    } 
    if(check("usdt_balance")){
        if(!values.usdt_balance) {
            errors.usdt_balance = "*"
        }
    }
    if(check("position_size")){
        if(!values.position_size) {
            errors.position_size = "*"
        }
    }

    return errors
}

export default validation