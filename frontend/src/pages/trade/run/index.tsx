import {useAppDispatch, useAppSelector} from '@redux/hooks/useRedux';
import { localGet, localSet } from '@utils/localstorage';
import Trades from '@redux/actions/trades';

import { MdPlayArrow } from 'react-icons/md';

import Container from '@components/container/Style1';
import Button from '@components/buttons/Button';
import Input from '@components/inputs/Input';
import Flex from '@components/flex/Flex';
import Text from '@components/text/Style1';
import Spinner from '@components/loading/Spinner';
import Form from '@components/form/Form';
import Label from '@components/form/Label';
import useForm from '@hooks/useForm';
import validation from '@validations/trading';
import { useEffect } from 'react';

const Run = () => {

  const dispatch = useAppDispatch();

  const {price_snapshot, isTrading, trading} = useAppSelector(state => state.trades);

  const previous = localGet("previous-trade-inputs");

  const initialState = {
    usdt_balance: previous.usdt_balance || 0,
    position_size: previous.position_size || 0,
    reset: previous.reset || 0,
    leverage: previous.leverage || 1,
    live: trading ? trading.live : true,
  };

  const {values, errors, onChange, onSubmit, onSetValue, setValues} = useForm(initialState, callback, validation);

  const position_size = (): number => (values.position_size / price_snapshot) / 10 / values.leverage;

  async function callback(){
    const isOutOfFundRange = position_size() >= values.usdt_balance;
    if(isOutOfFundRange) return;
    const inputs = {
      usdt_balance: Math.abs(values.usdt_balance),
      position_size: Math.abs(values.position_size),
      reset: Math.abs(values.reset) || 0,
      leverage: 0 >= values.leverage ? 1 : Math.abs(values.leverage),
    }
    dispatch(Trades.start({...values, ...inputs}));
    localSet("previous-trade-inputs", inputs);
  };

  const onChangeEnvironment = () => {
    if(trading) return;
    onSetValue({live: !values.live})
  };

  useEffect(() => {
    if(trading) setValues(state => ({...state, live: trading.live}));
  }, [trading, setValues])

  return (
    <Form onSubmit={onSubmit} button={false}>
      <Container background='dark'>
        
          <Button label1={!isTrading ? "Start trading" : "Stop trading"} label2={isTrading ? <Spinner size={15} color="white" /> : <MdPlayArrow/>} color="blue" style={{"marginBottom": "0.5rem"}}/>

          {!isTrading &&
            <>
              <Label label1="Environment" label2={!trading && "Once set cannot change"}/>
              <Button label1={values.live ? "Live" : "Test"} onClick={onChangeEnvironment} type="button" color='light' style={{"marginBottom": "0.5rem"}}/>

              <Input disabled={isTrading} type="number" label1="Reset price snapshot in minutes" label2="optional" placeholder='minutes (default never reset)'
                name="reset" value={values.reset || ""} onChange={onChange} 
              />

              <Flex>
                <Input disabled={isTrading} type="number" label1="Usdt balance" label2={errors.usdt_balance} error 
                  name="usdt_balance" value={values.usdt_balance || ""} onChange={onChange} 
                />

                <Input disabled={isTrading} type="number" label1="Position size" label2={errors.position_size} error 
                  name="position_size" value={values.position_size || ""} onChange={onChange} 
                />
                <Input disabled={isTrading} type="number" label1="Leverage" label2={errors.leverage} error placeholder='(optional) default is 1' 
                  name="leverage" value={values.leverage || ""} onChange={onChange} 
                />
              </Flex>

              <Text name={"Estimated cost"} value={`£${position_size().toFixed(2)}`} />

              {position_size() > values.usdt_balance ? <Text name="" value="Position size must be less than usdt balance" valueColor="red"/> : ""}
              
            </>
          }

          {isTrading &&
            <>
              <Text name="Environment" value={values.live ? "Live" : "Test"} />
              <Text name="Reset price snapsnot" value={`${values.reset} minutes`} />
              <Text name="Usdt balance" value={`$${values.usdt_balance}`} />
              <Text name="Position size" value={values.position_size} />
              <Text name="Leverage" value={`${values.leverage === 0 ? 1 : values.leverage}x`} />
            </>
          }

      </Container>
    </Form>
  )
}

export default Run