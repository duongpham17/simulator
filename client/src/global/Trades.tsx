import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import Trades from '@redux/actions/trades';

const TradesGlobal = () => {

  const dispatch = useAppDispatch();

  const {strategy} = useAppSelector(state => state.strategies);

  const {isTrading, inputs, orders, trading} = useAppSelector(state => state.trades);

  useEffect(() => {
    let timeout: any;

    if(!isTrading || !inputs || !strategy) return;

    const onRun = () => dispatch(Trades.test({...strategy, ...inputs}, trading || null, orders ? orders.slice(-1)[0] : null));
    timeout = setTimeout(onRun, 1000);
  
    return () => clearTimeout(timeout);
  }, [isTrading, orders, inputs, dispatch, trading, strategy]);

  return (null)
}

export default TradesGlobal