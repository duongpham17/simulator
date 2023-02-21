import validation from '@validations/trading';
import Strategies from '@redux/actions/strategies';
import { IStrategies } from '@redux/types/strategies';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';

import useForm from '@hooks/useForm';

import Summary from '@components/summary/Style1';
import Form from '@components/form/Form';
import Button from '@components/buttons/Button';

import {FaHammer} from 'react-icons/fa';
import {AiOutlineInfo} from 'react-icons/ai';

import Exchange from './Exchange';
import General from './General';
import Strategy from './Strategy';

interface Props {
  onOpen: CallableFunction
};

const Build = ({onOpen}: Props) => {

  const dispatch = useAppDispatch();

  const {status} = useAppSelector(state => state.strategies); 

  const initialState: Partial<IStrategies> = {
    name: "",
    strategy: "",
    market_id: "",
    short: 0,
    long: 0,
    stop_loss: 0,
    take_profit: 0,
    trailing_take_profit: false,
    exchange: "",
    api_key: "",
    secret_key: "",
    passphrase: "",
  };
  
  const {onSubmit, values, onChange, errors, onSetValue, loading} = useForm(initialState, callback, validation, true);

  //63f260d6cae7e0000188c449
  //b296a905-8c36-49c8-9fa8-0180ff6c1d1b

  async function callback(){
    const data = {
      ...values,
      short: Number(values.short),
      long: Number(values.long),
      stop_loss: Number(values.stop_loss),
      take_profit: Number(values.take_profit),
    }
    await dispatch(Strategies.build(data));
  };

  const onExtendOpen = (e: any) => {
    e.stopPropagation()
    onOpen()
  };

  const context = {
    values, 
    onChange, 
    errors, 
    onSetValue,
  }

  return (
    <Summary title="Build trading bot" open={false} iconOpen={<AiOutlineInfo onClick={onExtendOpen}/>} iconClose={<FaHammer/>} background="dark">

      <Form onSubmit={onSubmit} button={false}>

        <Exchange {...context} />
        
        { status.check_api && <General {...context} /> }

        { values.strategy && <Strategy {...context} /> }

        { values.strategy && <Button label1="Build" label2={<FaHammer/>} color='blue' loading={loading} /> }
          
      </Form>

    </Summary>
  )
}

export default Build