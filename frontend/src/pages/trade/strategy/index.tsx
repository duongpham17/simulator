import { useAppSelector } from '@redux/hooks/useRedux';
import { IStrategies } from '@redux/types/strategies';

import useOpen from '@hooks/useOpen';

import Container from '@components/container/Style1';
import Line from '@components/line/Style1';
import Grid from '@components/grid/Style2';

import GeneralEdit from './edit/General';
import StrategyEdit from './edit/Strategy';
import PositionEdit from './edit/Position';

const Strategy = () => {
  
  const { isTrading } = useAppSelector(state => state.trades);

  const { strategy } = useAppSelector(state => state.strategies);

  const { openValue, onOpenValue } = useOpen("");

  const context = {
    strategy: strategy as IStrategies,
    onOpenValue,
    openValue,
  }

  return ( (!isTrading && strategy) ?
    <Container background='dark' margin>

      <Grid columns='0.15fr 1fr'>
        <GeneralEdit {...context} />
      </Grid>

      <Line/>
        
      <Grid columns='0.15fr 1fr'>
        <StrategyEdit {...context} />
      </Grid>

      <Line/>

      <Grid columns='0.15fr 1fr'>
        <PositionEdit {...context} />
      </Grid>

    </Container>
    :
    null
  )
}

export default Strategy