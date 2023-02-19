import { IOrders } from '@redux/types/orders';
import { useContext } from 'react';
import { Context } from 'context/useOrders';

import Text3 from '@components/text/Style3'
import ProfitNLossProgress from '@components/progress/ProfitNLoss';
import Container from '@components/container/Style1';
import Flex from '@components/flex/Flex';

const Index = () => {
    const {orders} = useContext(Context)
    return ( orders && <Stats orders={orders}/> )
}

interface Props {
    orders: IOrders[]
}

const Stats = ({orders}: Props) => {
    const win_rate = (() => {
        const data = orders.reduce((acc, obj) => {
            const calc = obj.profit_loss >= 0 ? "win" : "lose";
            return {...acc, [calc]: acc[calc] + 1};
        }, {
            win: 0,
            lose: 0
        });
        const win_percentage = ((data.win / orders.length) * 100).toFixed(2);
        return {
            percentage: win_percentage === "NaN" ? 0 : win_percentage,
            win: data.win,
            lose: data.lose
        }
    })();

    const profit_loss = orders.reduce((acc, obj) => {
        const calc = obj.profit_loss >= 0 ? 'profit' : 'loss';
        return {...acc, [calc]: acc[calc] + obj.profit_loss};
    }, {
        profit: 0,
        loss: 0
    });

    return (
        <Container background='dark' margin>
            
            <Text3 name={<span>Profit &#x2022; {win_rate.percentage}%</span>} value={<span>{(100 - Number(win_rate.percentage)).toFixed(2)}% &#x2022; Loss</span>} />
            <ProfitNLossProgress value={Number(win_rate.percentage)}/>
            <Flex>
                <p>${profit_loss.profit.toFixed(2)}</p>
                <p>Trades {orders.length}</p>
                <p>${profit_loss.loss.toFixed(2)}</p>
            </Flex>

        </Container>
    )
}

export default Index