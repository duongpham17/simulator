import { IStrategies } from '@redux/types/strategies';
import { SummaryPageProps } from './@types'

export const initialState: Partial<IStrategies> = {
    name: "",
    live: false,
  
    exchange: "",
    api_key: "",
    secret_key: "",
    passphrase: "",

    market_id: "",
    
    strategy: "",
    short: 0,
    long: 0,
    stop_loss: 0,
    take_profit: 0,
    trailing_take_profit: false,
  
    reset: 0,
    leverage: 0,
    position_size: 0,
    usdt_balance: 0,
};
  
export const initialSummaryPage: SummaryPageProps = {
    exchange: {
      open: true,
      next: true,
    }, 
    general: {
      open: false,
      next: false,
    }, 
    marketId:{
      open: false,
      next: false,
    },
    strategy: {
      open: false,
      next: false,
    }, 
    position: {
      open: false,
      next: false
    } 
  }