import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Trades from '@redux/actions/trades';

import { MdPlayArrow } from 'react-icons/md';

import Button from '@components/buttons/Button';
import Loading from '@components/loading/Flyingdots';

const Run = () => {

  const dispatch = useAppDispatch();

  const {isTrading} = useAppSelector(state => state.trades);

  const onRun = () => dispatch(Trades.start());

  return (
    <Button label1={!isTrading ? "Start trading" : "Stop trading"} label2={isTrading ? <Loading /> : <MdPlayArrow/>} color="blue" margin onClick={onRun}/>
  )
}

export default Run