import { useAppSelector } from '@redux/hooks/useRedux';

import Container from '@components/container/Style1';
import Text2 from '@components/text/Style2';
import Flex from '@components/flex/Flex';

const Simulator = () => {
  
  const {simulator} = useAppSelector(state => state.simulators);

  const profit_loss = simulator?.orders.reduce((acc, obj) => {
    const calc = obj.profit_loss >= 0 ? 'profit' : "loss";
    return {...acc, [calc]: acc[calc] + obj.profit_loss};
  }, {
    profit: 0,
    loss: 0
  });

  const win_rate = () => {
    if(!simulator) return;
    const data = simulator?.orders.reduce((acc, obj) => {
      const calc = obj.profit_loss >= 0 ? "win" : "lose";
      return {...acc, [calc]: acc[calc] + 1};
    }, {
      win: 0,
      lose: 0
    });
    const win_percentage = ((data.win / simulator?.orders.length) * 100).toFixed(2);
    return win_percentage;
  }

  return ( simulator 
    ?
      <Container background='dark' style={{"marginBottom": "0.5rem"}}>
        <Flex center>
          <Text2 name="Trades" value={simulator.orders.length} />
          <Text2 name="%Win" value={win_rate()}  />
          <Text2 name="$Profit" value={`${(profit_loss?.profit)?.toFixed(2) || "0"}`} color="green" />
          <Text2 name="$Loss" value={`${(profit_loss?.loss)?.toFixed(2) || "0"}`} color="red" />
        </Flex>
      </Container>
    :
      null
  )
}

export default Simulator