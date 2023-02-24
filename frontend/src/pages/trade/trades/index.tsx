import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Trades from '@redux/actions/trades';
import useLoading from '@hooks/useLoading';
import {date} from '@utils/functions';

import Swiper from '@components/swiper/Style1';

import Button from '@components/buttons/Button';
import Text1 from '@components/text/Style1';
import Text3 from '@components/text/Style3';
import Element from '@components/element/Style1';
import Hidden from '@components/hidden'

import {AiFillDatabase} from 'react-icons/ai';

const TradesContainer = () => {

    const {loading, onLoading} = useLoading();

    const dispatch = useAppDispatch();

    const {trades, trading, isTrading} = useAppSelector(state => state.trades);

    const onChangeDataSet = () => {
        dispatch(Trades.clear("trading", null));
        dispatch(Trades.clear("prices", null));
        dispatch(Trades.clear("orders_closed", null));
        dispatch(Trades.clear("orders_open", null));
    };

    return ( 
        <>
            {trades && !isTrading &&
                <Hidden hide={!trading ? false : true}>
                    <Swiper data={trades} slidersPerView={3} pagination="fraction">
                        {(el) => 
                            <Element key={el._id} border pointer onClick={() => onLoading(() => dispatch(Trades.load(el._id)))} selected={loading} loading={loading}>
                                <Text3 name={date(el.createdAt)} value={""} size={14}/>
                                <Text1 name="data" value={el.prices_count} size={14}/>
                            </Element>
                        }
                    </Swiper>
                </Hidden>
            }

            {trading && !isTrading &&
                <Button label1="Clear trading data" label2={<AiFillDatabase/>} onClick={onChangeDataSet} color="dark" margin/>
            }
        </>
    )
}

export default TradesContainer