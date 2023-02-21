import kucoin_futures_usdt_pairs from '@data/exchange-kucoin-futures-usdt';
import strategies_data from '@data/strategies';

import {BuildProps} from './@types';

import Label from '@components/form/Label';
import Select from '@components/select/Select';
import List from '@components/select/List';
import Input from '@components/inputs/Input';
import Line from '@components/line/Style1';
import Search from '@components/inputs/Search';

const General = ({values, errors, onChange, onSetValue}:BuildProps) => {
  return (
    <>
      <Line />
      
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
  )
}

export default General