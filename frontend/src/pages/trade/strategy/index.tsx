import {useState} from 'react';
import {useAppSelector} from '@redux/hooks/useRedux';

import Edit from './Edit';

import Container from '@components/container/Style1';
import Header from '@components/buttons/Header';
import Text from '@components/text/Style1';
import Line from '@components/line/Style1';

import {MdModeEditOutline, MdClose} from 'react-icons/md';

const Strategy = () => {
  
  const { isTrading } = useAppSelector(state => state.trades);

  const { strategy } = useAppSelector(state => state.strategies);

  const [ isEdit, setIsEdit ] = useState(false);

  return ( (!isTrading && strategy) ?
    <Container selected={isEdit} background='dark' margin>

      <Header label1={<>{strategy.name} &#x2022; {strategy.market_id.toLowerCase()}</>} label2={isEdit ? <MdClose/> : <MdModeEditOutline/>} onClick={() => setIsEdit(!isEdit)}/>

      <Line/>
      <Text name="Market id" value={strategy.market_id.toLowerCase()} />
      <Text name="Exchange" value={strategy.exchange} />
      {!isEdit &&
        <>
          <Text name="Strategy" value={strategy.strategy} />
          <Line/>
          <Text name="Long" value={strategy.long} />
          <Text name="Short" value={strategy.short} />
          <Line/>
          <Text name="Stop loss" value={strategy.stop_loss} />
          <Text name="Take profit" value={strategy.take_profit} />
          <Line/>
          <Text name="Reset price snapshot" value={strategy.reset > 0 ? `${strategy.reset} minute` : "off"} />
          <Text name="Trailing take profit" value={strategy.trailing_take_profit ? "on" : "off"} />
        </>
      }   
      { isEdit && <Edit data={strategy} setIsEdit={setIsEdit} />}
    
    </Container>
    :
    null
  )
}

export default Strategy