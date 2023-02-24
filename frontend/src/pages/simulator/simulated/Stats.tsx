import { ISimulatorSimulated } from '@redux/types/simulators';

import Text2 from '@components/text/Style2';
import Text3 from '@components/text/Style3';
import Flex from '@components/flex/Flex';
import Line from '@components/line/Style1';
import ProfitNLossProgress from '@components/progress/ProfitNLoss';

interface Props {
    data: ISimulatorSimulated
}

const Stats = ({data}: Props) => {

    const { strategy, orders } = data;

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
        <>
            <Line />
            <Text3 name={<span>Profit &#x2022; {win_rate.percentage}%</span>} value={<span>{(100 - Number(win_rate.percentage)).toFixed(2)}% &#x2022; Loss</span>} />
            <ProfitNLossProgress value={Number(win_rate.percentage)}/>
            <Flex>
                <p>${profit_loss.profit.toFixed(2)}</p>
                <p>Trades {orders.length}</p>
                <p>${profit_loss.loss.toFixed(2)}</p>
            </Flex>
            <Line />
            <Flex>
                <Text2 name="Reset" value={strategy.reset >= 0 ? strategy.reset : "off"}/>
                <Text2 name="Long" value={strategy.long} />
                <Text2 name="Short" value={strategy.short}/>
            </Flex>
            <Flex>
                <Text2 name="Trailing" value={strategy.trailing_take_profit ? "on" : "off"}/>
                <Text2 name="Take profit" value={strategy.take_profit}/>
                <Text2 name="Stop Loss" value={strategy.stop_loss}/>
            </Flex>
        </>
    )
}

export default Stats