import strategies_data, {find_side} from '@data/strategies';
import useForm from '@hooks/useForm';
import validation from '@validations/simulate';

import Simulators from '@redux/actions/simulators';
import {IStrategiesInputsSimulate} from '@redux/types/strategies';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';

import Container from '@components/container/Style1';
import Form from '@components/form/Form';
import Label from '@components/form/Label';
import Flex from '@components/flex/Flex';
import Select from '@components/select/Select';
import List from '@components/select/List';
import Input from '@components/inputs/Input';
import Button from '@components/buttons/Button';
import Loading from '@components/loading/Boxes';


import {FaHammer} from 'react-icons/fa';

const Run = () => {

  const dispatch = useAppDispatch();

  const {simulator} = useAppSelector(state => state.simulators)

  const initialState: IStrategiesInputsSimulate = {
    strategy: "",
    reset: 0,
    short: 0,
    long: 0,
    stop_loss: 0,
    trailing_take_profit: 0,
    leverage: 0,
    position_size: 0,
  }
  
  const {onSubmit, values, onChange, errors, onSetValue, loading} = useForm(initialState, callback, validation);

  async function callback(){
    if(!simulator) return;
    const data = {
        ...values,
        reset: Number(values.reset),
        short: Number(values.short),
        long: Number(values.long),
        stop_loss: Number(values.stop_loss),
        trailing_take_profit: Number(values.trailing_take_profit),
        leverage: Number(values.leverage),
        position_size: Number(values.position_size),
    }
    await dispatch(Simulators.simulate(data, simulator._id));
  };


  return (
    <Container>
        {loading && <Loading/>}

        <Form onSubmit={onSubmit} button={false}>
            <>

                <Input type="number" label1="Reset price snapshot" label2="optional" placeholder='minutes (default never reset)'
                    name="reset" value={values.reset || ""} onChange={onChange} 
                />

                <Label label1="Trading strategy" label2={errors.strategy} error />
                <Select label1="Select" items={strategies_data} selected={values.strategy}>
                {(strategies) => 
                    strategies.map((el, i) => 
                    <List key={i} value={el.name} hover={el.description} onClick={() => onSetValue({strategy: el.name})} />  
                )}
                </Select>
                
                <Flex>
                    <Input type="number" label1="Leverage" label2={errors.leverage} error 
                        name="leverage" value={values.leverage || ""} onChange={onChange} 
                    />
                    <Input type="number" label1="Position size" label2={errors.position_size} error={errors.position_size} 
                        name="position_size" value={values.position_size || ""} onChange={onChange} 
                    />
                </Flex>
                
                { find_side(values.strategy) === "both" &&
                    <Flex>
                        <Input type="number" label1="Long at price difference" placeholder='default 0'
                            name="long" value={values.long || ""} onChange={onChange} 
                        />
                        <Input type="number" label1="Short at price difference" placeholder='default 0'
                            name="short" value={values.short || ""} onChange={onChange} 
                        />
                    </Flex>
                }

                { find_side(values.strategy) === "buy" &&
                    <Input type="number" label1="Long at price difference" placeholder='default 0'
                        name="long" value={values.long || ""} onChange={onChange} 
                    />
                }

                { find_side(values.strategy) === "sell" &&
                    <Input type="number" label1="Short at price difference" placeholder='default 0'
                        name="short" value={values.short || ""} onChange={onChange} 
                    />
                }

                <Flex>
                    <Input type="number" label1="Trailing take profit difference" label2={errors.trailing_take_profit} error 
                        name="trailing_take_profit" value={values.trailing_take_profit || ""} onChange={onChange} 
                    />
                    <Input type="number" label1="Stop loss at price difference" label2={errors.stop_loss} error 
                        name="stop_loss" value={values.stop_loss || ""} onChange={onChange} 
                    />
                </Flex>
             
                <Button label1="Start simulation" label2={<FaHammer/>} color='blue' loading={loading} />
            </>
        </Form>

    </Container>
  )
}

export default Run