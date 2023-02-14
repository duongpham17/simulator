import { useAppSelector } from '@redux/hooks/useRedux';
import useQuery from '@hooks/useQuery';

import Element from './Element';

const Scripts = () => {

  const { strategies } = useAppSelector(state => state.strategies);

  const {setQuery, getQueryValue} = useQuery();

  const query_strategy_id = getQueryValue("strategy");

  return ( !strategies ? null :
    <>
      {strategies.map(el => 
        <Element key={el._id} strategy={el} query_strategy_id={query_strategy_id} setQuery={setQuery} /> 
      )}
    </>
  )
}

export default Scripts