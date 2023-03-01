import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import { BuildProps } from './@types';

import { IStrategies } from '@redux/types/strategies';

import validation from '@validations/trading';
import useForm from '@hooks/useForm';

import Form from '@components/form/Form';
import FormSummary from '@components/form/Summary';
import Flex from '@components/flex/Flex';
import Input from '@components/inputs/Input';
import Text1 from '@components/text/Style1';
import Text3 from '@components/text/Style3';
import Button from '@components/buttons/Button';
import Strategies from '@redux/actions/strategies';

const Position = ({buildData, summaryPage, onSummaryPage, onClearBuildData}: BuildProps) => {
    const dispatch = useAppDispatch();

    const {status} = useAppSelector(state => state.strategies);

    const initialState: Partial<IStrategies> = {
        reset: 0,
        leverage: 0,
        position_size: 0,
        usdt_balance: 0,
    };

    const {values, errors, onChange, onSubmit, loading} = useForm(initialState, callback, validation.position);

    const position_value = (position_size: number, price_snapshot: number, leverage: number): number => {
        return (position_size / price_snapshot) / 10 / leverage;
    };

    async function callback() {
        if(values.usdt_balance && position_value(values.position_size || 0, status.check_market_id, values.leverage || 0) > values.usdt_balance) return;
        const default_value = Number((Number(status.check_market_id) / 10).toFixed(6));
        const inputs = {
            ...buildData,
            short: Number(buildData.short) !== 0 ? Number(buildData.short) : default_value,
            long: Number(buildData.long) !== 0 ? Number(buildData.long) : default_value,
            stop_loss: Number(buildData.stop_loss) !== 0 ? Number(buildData.stop_loss) : default_value,
            take_profit: Number(buildData.take_profit) !== 0 ? Number(buildData.take_profit) : default_value,
            reset: Number(buildData.reset),

            leverage: Number(values.leverage) !== 0 ? Number(values.leverage) : 1,
            position_size: Number(values.position_size),
        }
        await dispatch(Strategies.build({...inputs, ...values}));
        onClearBuildData();
    };

    return (
        <FormSummary name='Position' selected={summaryPage.position.open} onClick={() => onSummaryPage("position")}>
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

                <Text1 name={"Estimated cost"} value={`£${position_value(values.position_size || 0, status.check_market_id, values.leverage || 0).toFixed(2)}`} />
                
                {values.usdt_balance && position_value(values.position_size || 0, status.check_market_id, values.leverage || 0) > values.usdt_balance 
                    ? <Text3 name="Must be less than usdt balance" value="" color='red' /> : ""
                }

                <Button type='submit' label1="build" color='blue' loading={loading}/>

            </Form>
        </FormSummary>
  )
}

export default Position