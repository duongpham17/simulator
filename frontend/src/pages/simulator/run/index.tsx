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
        strategy: previous?.strategy || "",
        reset: previous?.reset || 0,
        short: previous?.short || 0,
        long: previous?.long || 0,
        trailing_take_profit: previous?.trailing_take_profit || false,
        stop_loss: previous?.stop_loss || 0,
        take_profit: previous?.take_profit || 0,
        leverage: previous?.leverage || 0,
        position_size: previous?.position_size || 0,
    };
    
    const {onSubmit, values, onChange, errors, onSetValue, loading} = useForm(initialState, callback, validation);

    async function callback(){
        if(!simulator) return;
        const default_value = Number(simulator.price_snapshot) / 10;
        const inputs = {
            ...values,
            short: Number(values.short) !== 0 ? Number(values.short) : default_value,
            long: Number(values.long) !== 0 ? Number(values.long) : default_value,
            stop_loss: Number(values.stop_loss) !== 0 ? Number(values.stop_loss) : default_value,
            take_profit: Number(values.take_profit) !== 0 ? Number(values.take_profit) : default_value,
            leverage: Number(values.leverage) !== 0 ? Number(values.leverage) : 1,
            position_size: Number(values.position_size),
            reset: Number(values.reset),
        };
        await dispatch(Simulators.simulate(inputs, simulator._id));
        localSet("previous-simulator-inputs", inputs);
    };

  return (
    <Container background='dark' margin>
        {loading && <Loading/>}

        <Form onSubmit={onSubmit} button={false}>
            <>
                <Button type="submit" label1="Start simulation" label2={<FaHammer/>} color='blue' loading={loading} margin/>

                <Label label1="Trading strategy" label2={errors.strategy} error />
                <Select label1="Select" items={strategies_data} selected={values.strategy}>
                {(strategies) => 
                    strategies.map((el, i) => 
                    <List key={i} value={el.name} hover={el.description} selected={values.strategy === el.name} onClick={() => onSetValue({strategy: el.name})} />  
                )}
                </Select>
                
                <Flex>
                    <Input type="number" label1="Leverage" label2={errors.leverage} error placeholder='default 1'
                        name="leverage" value={values.leverage} onChange={onChange} 
                    />
                    <Input type="number" label1="Position size" label2={errors.position_size} error={errors.position_size} 
                        name="position_size" value={values.position_size} onChange={onChange} 
                    />
                </Flex>
                
                { find_side(values.strategy) === "both" &&
                    <Flex>
                        <Input type="number" label1="Long difference" placeholder='default 10% of current price'
                            name="long" value={values.long} onChange={onChange} 
                        />
                        <Input type="number" label1="Short difference" placeholder='default 10% of current price'
                            name="short" value={values.short} onChange={onChange} 
                        />
                    </Flex>
                }

                { find_side(values.strategy) === "buy" &&
                    <Input type="number" label1="Long difference" placeholder='default 10% of current price'
                        name="long" value={values.long} onChange={onChange} 
                    />
                }

                { find_side(values.strategy) === "sell" &&
                    <Input type="number" label1="Short difference" placeholder='default 10% of current price'
                        name="short" value={values.short} onChange={onChange} 
                    />
                }

                <Flex>
                    <Input type="number" label1="Take profit difference" placeholder='default 10% of current price'
                        name="take_profit" value={values.take_profit} onChange={onChange} 
                    />
                    <Input type="number" label1="Stop loss difference" placeholder='default 10% of current price'
                        name="stop_loss" value={values.stop_loss} onChange={onChange} 
                    />
                </Flex>

                <Input type="number" label1="Reset price snapshot" label2="optional" placeholder='minutes (default never reset)'
                    name="reset" value={values.reset || ""} onChange={onChange} 
                />

                <Checkbox label="Trailing take profit" margin value={values.trailing_take_profit} onClick={() => onSetValue({trailing_take_profit: !values.trailing_take_profit})} background="light" />             
            </>
        </Form>

    </Container>
  )
}

export default Run