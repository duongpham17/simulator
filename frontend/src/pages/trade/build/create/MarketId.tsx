import { BuildProps } from './@types';

import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { IStrategies } from '@redux/types/strategies';
import validation from '@validations/trading';
import useForm from '@hooks/useForm';

import kucoin_futures_usdt_pairs from '@data/exchange-kucoin-futures-usdt';
import Search from '@components/inputs/Search';

import Form from '@components/form/Form';
import FormSummary from '@components/form/Summary';
import Button from '@components/buttons/Button';
import Text3 from '@components/text/Style3';
import Strategies from '@redux/actions/strategies';


const Strategy = ({addToBuildData, summaryPage, onSummaryPage}: BuildProps) => {

    const dispatch = useAppDispatch();

    const {status} = useAppSelector(state => state.strategies);

    const initialState: Partial<IStrategies> = {
        market_id: "",
    };

    const {values, errors, onChange, onSetValue, onSubmit, loading} = useForm(initialState, callback, validation.marketId);

    async function callback() {
        const res = await dispatch(Strategies.checkMarketId({
            secret_key: values.secret_key as string, 
            api_key: values.api_key as string, 
            passphrase: values.passphrase as string, 
            market_id: values.market_id as string
        }));
        if(!res) return
        addToBuildData(values);
        onSummaryPage("general");
    };

    const onSelectMarketId = (value: string) => {
        onSetValue({market_id: value});
    };

    return (
        <FormSummary name='Market id' value={values.market_id?.toLowerCase()} selected={summaryPage.marketId.open} onClick={() => ""}>
            <Form onSubmit={onSubmit} button={false}>

                <Search 
                    data={kucoin_futures_usdt_pairs}
                    label1="Market id" 
                    label2={errors.market_id ? errors.market_id : <a href="https://nomics.com/exchanges/kucoin_futures-kucoin-futures/markets" target="_blank" rel="noreferrer">List</a>} 
                    name="market_id" 
                    error 
                    value={values.market_id || ""} 
                    onChange={onChange}
                    onSelectValue={onSelectMarketId}
                    autoComplete="off"
                />

                { status.check_market_id === null &&
                    <Text3 name="Could not find market id" value="*" color='red'/>
                }

                <Button type="submit" label1="check market id" color='blue' loading={loading}/>
            
            </Form>
        </FormSummary>
    )
}

export default Strategy