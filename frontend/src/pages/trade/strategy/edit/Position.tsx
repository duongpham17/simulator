import { EditProps } from './@types';
import validations from '@validations/trading';
import {useAppDispatch, useAppSelector} from '@redux/hooks/useRedux';

import useForm from '@hooks/useForm';

import Text1 from '@components/text/Style1';
import Text3 from '@components/text/Style3';
import Form from '@components/form/Form';
import Input from '@components/inputs/Input';
import Button from '@components/buttons/Button';
import Flex from '@components/flex/Flex';
import Strategies from '@redux/actions/strategies';
import Openarrows from '@components/buttons/Openarrows';
import Container from '@components/container/Style2';

const PositionEdit = ({strategy, openValue, onOpenValue}: EditProps) => {
    
    const dispatch = useAppDispatch();

    const {price_snapshot} = useAppSelector(state => state.trades);

    const initialState: {
        usdt_balance: number,
        leverage: number,
        position_size: number,

    } = {
        ...strategy
    };
    
    const {onSubmit, values, onChange, errors, loading} = useForm(initialState, callback, validations.position);

    const position_value = (position_size: number, price_snapshot: number, leverage: number): number => {
        return (position_size / price_snapshot) / 10 / leverage;
    };

    async function callback(){
        if(values.usdt_balance && position_value(values.position_size || 0, price_snapshot, values.leverage || 0) > values.usdt_balance) return;
        await dispatch(Strategies.update({
            ...values,
            usdt_balance: Number(values.usdt_balance),
            leverage: Number(values.leverage) >= 0 ? Number(values.leverage) : 1,
            position_size: Number(values.position_size),
        }));
        onOpenValue("");
    };

    return (
        <>
            <Container onClick={() => onOpenValue("position")} pointer style={{padding: 0}}>
                <Flex>
                    <p> Position </p>
                    <Openarrows open={openValue === "position"}/>
                </Flex>
            </Container>

            {openValue === "position" ?
                <Form onSubmit={onSubmit} button={false}>

                    <Flex>
                        <Input type="number" label1="Usdt balance" label2={errors.usdt_balance} error 
                            name="usdt_balance" value={values.usdt_balance || ""} onChange={onChange} 
                        />

                        <Input type="number" label1="Leverage" label2={errors.leverage} error placeholder='default is 1' 
                            name="leverage" value={values.leverage || ""} onChange={onChange} 
                        />
                    </Flex>

                    <Input type="number" label1="Position size" label2={errors.position_size} error 
                        name="position_size" value={values.position_size || ""} onChange={onChange} 
                    />

                    <Text1 name={"Estimated cost"} value={`£${position_value(values.position_size || 0, price_snapshot, values.leverage || 0).toFixed(2)}`} />
                    
                    {values.usdt_balance && position_value(values.position_size || 0, price_snapshot, values.leverage || 0) > values.usdt_balance 
                        ? <Text3 name="Must be less than usdt balance" value="" color='red' /> : ""
                    }

                    <Button type='submit' label1="save" color='blue' loading={loading}/>

                </Form>
            :
                <div>
                    <Text1 name="Usdt Balance" value={`$${strategy.usdt_balance}`} />
                    <Text1 name="Leverage" value={`${strategy.leverage}x`} />
                    <Text1 name="Position size" value={strategy.position_size} />
                </div>
            }

        </>
    )
}

export default PositionEdit;