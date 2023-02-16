import Simulators from '@redux/actions/simulators';
import { IStrategiesInputsSimulate } from '@redux/types/strategies';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';

import strategies_data, {find_side} from '@data/strategies';
import useForm from '@hooks/useForm';
import validation from '@validations/simulate';
import {localSet, localGet} from '@utils/localstorage';

import Container from '@components/container/Style1';
import Form from '@components/form/Form';
import Label from '@components/form/Label';
import Flex from '@components/flex/Flex';
import Select from '@components/select/Select';
import List from '@components/select/List';
import Input from '@components/inputs/Input';
import Button from '@components/buttons/Button';
import Loading from '@components/loading/Boxes';
import Checkbox from '@components/inputs/Checkbox';

import {FaHammer} from 'react-icons/fa';

const Run = () => {

    const dispatch = useAppDispatch();

    const {simulator} = useAppSelector(state => state.simulators);

    const previous = localGet("previous-simulator-inputs");

    const initialState: IStrategiesInputsSimulate = {
        strategy: previous.strategy || "",
        reset: previous.reset || 0,
        short: previous.short || 0,
        long: previous.long || 0,
        trailing_take_profit: previous.trailing_take_profit || false,
        stop_loss: previous.stop_loss || 0,
        take_profit: previous.take_profit || 0,
        leverage: previous.leverage || 0,
        position_size: previous.position_size || 0,
    };
    
    const {onSubmit, values, onChange, errors, onSetValue, loading} = useForm(initialState, callback, validation);

    async function callback(){
        if(!simulator) return;
        const inputs = {
            ...values,
            reset: Number(values.reset),
            short: Number(values.short),
            long: Number(values.long),
            stop_loss: Number(values.stop_loss),
            take_profit: Number(values.take_profit),
            leverage: Number(values.leverage),
            position_size: Number(values.position_size),
        }
        await dispatch(Simulators.simulate(inputs, simulator._id));
        localSet("previous-simulator-inputs", inputs);
    };

  return (
    <Container background='dark' style={{"marginBottom": "0.5rem"}}>
        {loading && <Loading/>}

        <Form onSubmit={onSubmit} button={false}>
            <>
                <Button label1="Start simulation" label2={<FaHammer/>} color='blue' loading={loading} style={{"marginBottom": "0.5rem"}} />

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
                        name="leverage" value={values.leverage} onChange={onChange} 
                    />
                    <Input type="number" label1="Position size" label2={errors.position_size} error={errors.position_size} 
                        name="position_size" value={values.position_size} onChange={onChange} 
                    />
                </Flex>
                
                { find_side(values.strategy) === "both" &&
                    <Flex>
                        <Input type="number" label1="Long difference" placeholder='default 0'
                            name="long" value={values.long} onChange={onChange} 
                        />
                        <Input type="number" label1="Short difference" placeholder='default 0'
                            name="short" value={values.short} onChange={onChange} 
                        />
                    </Flex>
                }

                { find_side(values.strategy) === "buy" &&
                    <Input type="number" label1="Long difference" placeholder='default 0'
                        name="long" value={values.long} onChange={onChange} 
                    />
                }

                { find_side(values.strategy) === "sell" &&
                    <Input type="number" label1="Short difference" placeholder='default 0'
                        name="short" value={values.short} onChange={onChange} 
                    />
                }

                <Flex>
                    <Input type="number" label1="Take profit difference" label2={errors.trailing_take_profit} error 
                        name="take_profit" value={values.take_profit} onChange={onChange} 
                    />
                    <Input type="number" label1="Stop loss difference" label2={errors.stop_loss} error 
                        name="stop_loss" value={values.stop_loss} onChange={onChange} 
                    />
                </Flex>

                <Checkbox label="Trailing take profit" margin value={values.trailing_take_profit} onClick={() => onSetValue({trailing_take_profit: !values.trailing_take_profit})} background="light" />             
            </>
        </Form>

    </Container>
  )
}

export default Run