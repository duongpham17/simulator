import { useAppSelector } from '@redux/hooks/useRedux';

import Stats from './Stats';

const Simulator = () => {
  
  const {simulator} = useAppSelector(state => state.simulators);

  return ( simulator 
    ?
      <Stats orders={simulator.orders}/>
    :
      null
  )
}

export default Simulator
