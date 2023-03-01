import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import Trades from '@redux/actions/trades';

const TradesGlobal = () => {

  const dispatch = useAppDispatch();

  const {strategy} = useAppSelector(state => state.strategies);

  const {isTrading, orders_open, trading, price_latest} = useAppSelector(state => state.trades);

  useEffect(() => {
    let timeout: any;

    if(!isTrading || !strategy) return;

    const onRun = () => dispatch(Trades.trade(
        strategy, 
        trading || null, 
        orders_open ? orders_open.slice(-1)[0] : null, 
        price_latest
      )
    );
    
    timeout = setTimeout(onRun, 1000);
  
    return () => clearTimeout(timeout);
  }, [isTrading, orders_open, dispatch, trading, strategy, price_latest]);

  return (null)
}

export default TradesGlobal