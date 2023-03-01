import { EditProps } from './@types';
import validations from '@validations/trading';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { strategies, find_side } from '@data/strategies';

import useForm from '@hooks/useForm';

import Text1 from '@components/text/Style1';
import Form from '@components/form/Form';
import Input from '@components/inputs/Input';
import Button from '@components/buttons/Button';
import Checkbox from '@components/inputs/Checkbox';
import Strategies from '@redux/actions/strategies';
import Flex from '@components/flex/Flex';
import Select from '@components/select/Select';
import Label from '@components/form/Label';
import List from '@components/select/List';
import Openarrows from '@components/buttons/Openarrows';
import Container from '@components/container/Style2';


const StrategyEdit = ({strategy, openValue, onOpenValue}: EditProps) => {
    
    const dispatch = useAppDispatch();

    const {price_snapshot} = useAppSelector(state => state.trades);

    const initialState: {
        strategy: string,
        long: number,
        short: number,
        take_profit: number,
        stop_loss: number,
        reset: number,
        trailing_take_profit: boolean
    } = {
        ...strategy
    };
    
    const {onSubmit, values, onChange, errors, onSetValue, loading} = useForm(initialState, callback, validations.strategy);

    async function callback(){
        const default_value = Number((Number(price_snapshot) / 10).toFixed(6));
        const inputs = {
            ...values,
            short: Number(values.short) !== 0 ? Number(values.short) : default_value,
            long: Number(values.long) !== 0 ? Number(values.long) : default_value,
            stop_loss: Number(values.stop_loss) !== 0 ? Number(values.stop_loss) : default_value,
            take_profit: Number(values.take_profit) !== 0 ? Number(values.take_profit) : default_value,
            reset: Number(values.reset),
        }
        await dispatch(Strategies.update(inputs));
        onOpenValue("");
    };

    return (
        <>
            <Container onClick={() => onOpenValue("strategy")} pointer style={{padding: 0}}>
                <Flex>
                    <p> Strategy </p>
                    <Openarrows open={openValue === "strategy"}/>
                </Flex>
            </Container>

            {openValue === "strategy" ?
                <Form onSubmit={onSubmit} button={false}>

                <Label label1="Trading strategy" label2={errors.strategy} error />
                <Select label1="Select" items={strategies} selected={values.strategy}>
                    {(strategies) => 
                        strategies.map((el, i) => 
                        <List key={i} value={el.name} hover={el.description} onClick={() => onSetValue({strategy: el.name})} />  
                    )}
                </Select> 

                    {find_side(values.strategy) === "both" &&
                        <Flex>
                            <Input type="number" label1="Long difference" label2={errors.long} error 
                                name="long" value={values.long} onChange={onChange} 
                            />
                            <Input type="number" label1="Short difference" label2={errors.short} error 
                                name="short" value={values.short} onChange={onChange} 
                            />
                        </Flex>
                    }

                    { find_side(values.strategy) === "buy" &&
                        <Input type="number" label1="Long difference" label2={errors.long} error 
                            name="long" value={values.long} onChange={onChange} 
                        />
                    }

                    { find_side(values.strategy) === "sell" &&
                        <Input type="number" label1="Short difference" label2={errors.short} error 
                            name="short" value={values.short} onChange={onChange} 
                        />
                    }

                    <Flex>
                        <Input type="number" label1="Take profit difference" label2={errors.take_profit} error 
                            name="take_profit" value={values.take_profit} onChange={onChange} 
                        />
                        <Input type="number" label1="Stop loss difference" label2={errors.stop_loss} error 
                            name="stop_loss" value={values.stop_loss} onChange={onChange} 
                        />
                    </Flex>

                    <Flex>
                        <Input type="number" label1="Reset price snapshot" label2="optional"
                            name="reset" value={values.reset} onChange={onChange} 
                        />
                    </Flex>

                    <Checkbox label="Trailing take profit" margin value={values.trailing_take_profit} onClick={() => onSetValue({trailing_take_profit: !values.trailing_take_profit})} background="light" />

                    <Button type="submit" label1="save" color='blue' loading={loading} />
                    

                </Form>
            :
                <div>
                    <Text1 name="Strategy" value={strategy.strategy} />
                    <Text1 name="Long" value={strategy.long} />
                    <Text1 name="Short" value={strategy.short} />
                    <Text1 name="Take profit" value={strategy.take_profit} />
                    <Text1 name="Stop loss" value={strategy.stop_loss} />
                    <Text1 name="Reset" value={strategy.reset > 0 ? `${strategy.reset} minute` : "off"} />
                    <Text1 name="Trailing take profit" value={strategy.trailing_take_profit ? "on" : "off"} />
                </div>
            }

        </>
    )
}

export default StrategyEdit;