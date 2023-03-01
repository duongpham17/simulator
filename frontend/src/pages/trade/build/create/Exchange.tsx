
import {BuildProps} from './@types';
import exchanges_data from '@data/exchanges';
import Strategies from '@redux/actions/strategies';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import { IStrategies } from '@redux/types/strategies';

import useForm from '@hooks/useForm';
import validation from '@validations/trading';

import Form from '@components/form/Form';
import FormSummary from '@components/form/Summary';
import Label from '@components/form/Label';
import Flex from '@components/flex/Flex';
import Select from '@components/select/Select';
import List from '@components/select/List';
import Input from '@components/inputs/Input';
import Button from '@components/buttons/Button';
import Text3 from '@components/text/Style3';

const Exchange = ({addToBuildData, summaryPage, onSummaryPage}: BuildProps) => {

    const dispatch = useAppDispatch();

    const {status} = useAppSelector(state => state.strategies);

    const initialState: Partial<IStrategies> = {
        exchange: "kucoin",
        api_key: "63f260d6cae7e0000188c449",
        secret_key: "b296a905-8c36-49c8-9fa8-0180ff6c1d1b",
        passphrase: "powerful3398",
    };

    const {values, errors, onChange, onSetValue, loading, onSubmit} = useForm(initialState, callback, validation.exchange);

    async function callback() {
        const res = await dispatch(Strategies.checkapi({
            api_key: values.api_key as string, 
            secret_key: values.secret_key as string, 
            passphrase: values.passphrase as string,
        }));
        if(!res) return;
        addToBuildData(values);
        onSummaryPage("marketId");
    };

    const onSelectExchange = (name: string) => {
        onSetValue({exchange: name});
        dispatch(Strategies.state_clear("status", ""));
    };

    return (
        <FormSummary name="Exchange" value={values.exchange} selected={summaryPage.exchange.open} onClick={() => ""} >
            <Form onSubmit={onSubmit} button={false}>

                <Label label1="Crypto exchange" label2={errors.exchange} error />
                <Select label1="Select" items={exchanges_data} selected={values.exchange}>
                    {(exchanges) => 
                    exchanges.map((el) => 
                        <List key={el.name} value={el.name} icon={el.icon} selected={values.exchange === el.name} onClick={() => onSelectExchange(el.name)} />  
                    )}
                </Select>

                { values.exchange &&
                    <Flex>
                        <Input type="password" autoComplete='' label1="Api key" label2={errors.api_key} error 
                            name="api_key" value={values.api_key} onChange={onChange} 
                        />
                        <Input type="password" autoComplete='' label1="Secret key" label2={errors.secret_key} error 
                            name="secret_key" value={values.secret_key} onChange={onChange} 
                        />
                        <Input type="password" autoComplete='' label1="Passphrase" label2={errors.passphrase} error 
                            name="passphrase" value={values.passphrase} onChange={onChange} 
                        />
                    </Flex>
                }

                { status.check_api === false &&
                    <Text3 name="Keys are incorrect" value="*" color='red'/>
                }
                
                <Button type="submit" label1="check keys" loading={loading} color="blue"/>
            
            </Form>
        </FormSummary>
  )
}

export default Exchange