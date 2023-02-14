export interface Validation {
    strategy: string, 
    leverage: string,
    position_size: string,
    long: string,
    short: string,
    trailing_take_profit: string,
    stop_loss: string
}

export const validation = (values: Validation) => {
    let errors: Partial<Validation> = {};

    const check = (key: any) => key in values;

    if(check("strategy")){
        if(!values.strategy) {
            errors.strategy = "*";
        }
    } 
    if(check("trailing_take_profit")){
        if(!values.trailing_take_profit) {
            errors.trailing_take_profit = "*";
        }
    } 
    if(check("stop_loss")){
        if(!values.stop_loss) {
            errors.stop_loss = "*";
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
    if(check("position_size")){
        if(!values.position_size) {
            errors.position_size = "*"
        }
    }

    return errors
}

export default validation