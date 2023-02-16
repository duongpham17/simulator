import { UseOrdersContext } from 'context/useOrders';

import Environment from './environment';
import Orders from './orders';
import Stats from './stats';
import Filter from './filter';

const History = () => {
  return (
    <UseOrdersContext>

      <Environment />

      <Stats  />

      <Filter />
      
      <Orders />

    </UseOrdersContext>
  )
}

export default History