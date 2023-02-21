import exchanges_data from '@data/exchanges';

import Strategies from '@redux/actions/strategies';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';

import {BuildProps} from './@types';

import Label from '@components/form/Label';
import Flex from '@components/flex/Flex';
import Select from '@components/select/Select';
import List from '@components/select/List';
import Input from '@components/inputs/Input';
import Button from '@components/buttons/Button';
import Text3 from '@components/text/Style3';

import useLoading from '@hooks/useLoading';

const Exchange = ({errors, values, onChange, onSetValue}: BuildProps) => {

    const dispatch = useAppDispatch();

    const {status} = useAppSelector(state => state.strategies);

    const {onLoading, loading: apiLoading} = useLoading();

    const onCheckApiPasswords = async () => {
        await onLoading(() => 
        dispatch(Strategies.checkapi({
            api_key: values.api_key || "", 
            secret_key: values.secret_key || "", 
            passphrase: values.passphrase || ""
        }))
        );
    };

    const onSelectExchange = (name: string) => {
        onSetValue({exchange: name});
        dispatch(Strategies.state_clear("status", ""));
    };

    return (
        <>
            <Label label1="Crypto exchange" label2={errors.exchange} error />
            <Select label1="Select" items={exchanges_data} selected={values.exchange}>
                {(exchanges) => 
                exchanges.map((el) => 
                    <List key={el.name} value={el.name} icon={el.icon} onClick={() => onSelectExchange(el.name)} />  
                )}
            </Select>

            { values.exchange &&
                <Flex>
                    <Input type="password" autoComplete='' label1="Api key" label2={errors.api_key} error name="api_key" value={values.api_key} onChange={onChange} />
                    <Input type="password" autoComplete='' label1="Secret key" label2={errors.secret_key} error name="secret_key" value={values.secret_key} onChange={onChange} />
                    <Input type="password" autoComplete='' label1="Passphrase" label2={errors.passphrase} error name="passphrase" value={values.passphrase} onChange={onChange} />
                </Flex>
            }

            { status.check_api === false &&
                <Text3 name="Please check keys" value="*" color='red'/>
            }

            { !status.check_api && values.api_key && values.secret_key && values.passphrase &&
                <Button label1="check keys" onClick={onCheckApiPasswords} loading={apiLoading} color="blue"/>
            }
        </>
  )
}

export default Exchange