import { useAppSelector } from '@redux/hooks/useRedux';

import Orders from './Orders'
import Stats from './Stats';

const History = () => {

    const {orders_closed} = useAppSelector(state => state.trades);
    
    return (  orders_closed
        ?  
            <>              
                <Stats orders={orders_closed} />

                <Orders orders={orders_closed} />
            </>      
        : 
            null
    )
}

export default History