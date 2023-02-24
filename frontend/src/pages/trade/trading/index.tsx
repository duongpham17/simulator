import { useAppSelector } from '@redux/hooks/useRedux';

import Waiting from './Waiting';
import Open from './Open';

const Trading = () => {

    const {isTrading} = useAppSelector(state => state.trades);

    const {orders_open, trading, price_latest} = useAppSelector(state => state.trades);

    const {strategy} = useAppSelector(state => state.strategies)

    const check_order_open = (): boolean => {
        const data = orders_open?.slice(-1)[0];
        if(!data) return false;
        return data.open
    };

    return (check_order_open() === true 
        ? 
            orders_open && trading && strategy && <Open orders={orders_open} isTrading={isTrading} trading={trading} strategy={strategy} price_latest={price_latest} />
        : 
            trading && strategy && <Waiting trading={trading} strategy={strategy} price_latest={price_latest}/>
    )
}

export default Trading