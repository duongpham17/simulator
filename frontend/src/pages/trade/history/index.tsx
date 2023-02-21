import { useAppSelector } from '@redux/hooks/useRedux';

import Orders from './Orders'
import Stats from './Stats';

const History = () => {

    const {orders} = useAppSelector(state => state.trades);
    
    return (  orders
        ?  
            <>              
                <Stats orders={orders} />

                <Orders orders={orders} />
            </>      
        : 
            null
    )
}

export default History