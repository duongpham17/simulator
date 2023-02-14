import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import Simulator from '@redux/actions/simulators';
import Alert from '@redux/actions/alert';
import useQuery from '@hooks/useQuery';
import useOpen from '@hooks/useOpen';
import useLoading from '@hooks/useLoading';

import {date} from '@utils/functions';

import Container from '@components/container/Style1';
import Dropdown from '@components/buttons/Dropdown';
import Spinner from '@components/loading/Spinner';
import Text3 from '@components/text/Style3';

import Button from '@components/buttons/Button';

const Simulators = ( ) => {

  const {setQuery, getQueryValue} = useQuery();

  const {openItems, onOpenItems} = useOpen()

  const {loading, onLoading} = useLoading();

  const {simulators} = useAppSelector(state => state.simulators);

  const {isTrading, trading} = useAppSelector(state => state.trades)

  const dispatch = useAppDispatch();

  const query = getQueryValue("simulator");

  const onQuickRun = (id: string) => (event: React.SyntheticEvent) =>  {
    if(id === query) return;
    event.stopPropagation();
    setQuery("simulator", id);
  };

  const onDelete = (id: string) => {
    if(isTrading && id === trading?._id) return dispatch(Alert.set("Simulator currently trading", "red"));
    onLoading(() => dispatch(Simulator.simulator_remove(id)))
  }

  return ( simulators ?
    <>
      {simulators.map(el =>
        <Container key={el._id} selected={query === el._id} onClick={onQuickRun(el._id)} pointer>
          <Text3 name={`${el.market_id} ${el.prices}`} value={loading ? <Spinner size={15}/> : <Dropdown open={openItems.includes(el._id)} onClick={() => onOpenItems(el._id)} />} />
          <Text3 name={date(el.createdAt)} value={el.live ? "Live" : "Test"} color='light' size={12}/>
          {openItems.includes(el._id) && 
            <Button label1="Delete data set" color="red" style={{padding: "0.3rem"}} onClick={() => onDelete(el._id)}/>
          }
        </Container>
      )}
    </>
    : 
      null
  )
}

export default Simulators