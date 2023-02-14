import kucoin_futures_usdt_pairs from '@data/exchange-kucoin-futures-usdt';
import strategies_data, {find_side} from '@data/strategies';
import exchanges_data from '@data/exchanges';
import validation from '@validations/trading';

import Strategies from '@redux/actions/strategies';
import { IStrategies } from '@redux/types/strategies';
import { useAppDispatch } from '@redux/hooks/useRedux';

import Summary from '@components/summary/Style1';
import Form from '@components/form/Form';
import Label from '@components/form/Label';
import Flex from '@components/flex/Flex';
import Select from '@components/select/Select';
import List from '@components/select/List';
import Input from '@components/inputs/Input';
import Search from '@components/inputs/Search';
import Button from '@components/buttons/Button';
import useForm from '@hooks/useForm';

import {FaHammer} from 'react-icons/fa';

const Build = () => {

  const dispatch = useAppDispatch();

  const initialState: Partial<IStrategies> = {
    name: "",
    strategy: "",
    market_id: "",
    short: 0,
    long: 0,
    stop_loss: 0,
    trailing_take_profit: 0,
    exchange: "",
    api_key: "",
    secret_key: "",
    passphrase: "",
  }
  
  const {onSubmit, values, onChange, errors, onSetValue, loading} = useForm(initialState, callback, validation, true);

  async function callback(){
    const data = {
      ...values,
      short: Number(values.short),
      long: Number(values.long),
      stop_loss: Number(values.stop_loss),
      trailing_take_profit: Number(values.trailing_take_profit),
    }
    await dispatch(Strategies.build(data));
  };

  return (
    <Summary title="Build trading bot" style={{"marginBottom": "0.5rem"}} open={false} iconOpen={<FaHammer/>}>

      <Form onSubmit={onSubmit} button={false}>
        <>
          <Label label1="Crypto exchange" label2={errors.exchange} error />
          <Select label1="Select" items={exchanges_data} selected={values.exchange}>
            {(exchanges) => 
              exchanges.map((el) => 
                <List key={el.name} value={el.name} icon={el.icon} onClick={() => onSetValue({exchange: el.name})} />  
            )}
          </Select>

          { values.exchange &&
            <Flex>
              <Input type="password" autoComplete='' label1="Api key" label2={errors.api_key} error name="api_key" value={values.api_key} onChange={onChange} />
              <Input type="password" autoComplete='' label1="Secret key" label2={errors.secret_key} error name="secret_key" value={values.secret_key} onChange={onChange} />
              <Input type="password" autoComplete='' label1="Passphrase" label2={errors.passphrase} error name="passphrase" value={values.passphrase} onChange={onChange} />
            </Flex>
          }

          { values.secret_key && values.api_key && values.passphrase &&
            <>

              <Input type="text" label1="Name of script" label2={errors.name} error name="name" value={values.name} onChange={onChange} />

              <Search 
                data={kucoin_futures_usdt_pairs}
                label1="Market id" 
                label2={errors.market_id ? errors.market_id : <a href="https://nomics.com/exchanges/kucoin_futures-kucoin-futures/markets" target="_blank" rel="noreferrer">List</a>} 
                name="market_id" 
                error 
                value={values.market_id || ""} 
                onChange={onChange}
                onSelectValue={(value) => onSetValue({market_id: value})}
              />

              <Label label1="Trading strategy" label2={errors.strategy} error />
              <Select label1="Select" items={strategies_data} selected={values.strategy}>
                {(strategies) => 
                  strategies.map((el, i) => 
                    <List key={i} value={el.name} hover={el.description} onClick={() => onSetValue({strategy: el.name})} />  
                )}
              </Select>

            </>
          }

          {values.strategy &&
            <>
              {find_side(values.strategy) === "both" &&
                <Flex>
                  <Input type="number" label1="Long at price difference" label2={errors.long} error name="long" value={values.long} onChange={onChange} />
                  <Input type="number" label1="Short at price difference" label2={errors.short} error name="short" value={values.short} onChange={onChange} />
                </Flex>
              }

              { find_side(values.strategy) === "buy" &&
                <Input type="number" label1="Long at price difference" label2={errors.long} error name="long" value={values.long} onChange={onChange} />
              }

              { find_side(values.strategy) === "sell" &&
                <Input type="number" label1="Short at price difference" label2={errors.short} error name="short" value={values.short} onChange={onChange} />
              }

              <Flex>
                <Input type="number" label1="Trailing take profit difference" label2={errors.trailing_take_profit} error name="trailing_take_profit" value={values.trailing_take_profit} onChange={onChange} />
                <Input type="number" label1="Stop loss at price difference" label2={errors.stop_loss} error name="stop_loss" value={values.stop_loss} onChange={onChange} />
              </Flex>
            </>
          }

          {values.strategy &&
            <Button label1="Build" label2={<FaHammer/>} color='blue' loading={loading} />
          }

        </>
      </Form>

    </Summary>
  )
}

export default Build