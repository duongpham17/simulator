import { ISimulator } from '@redux/types/simulators';
import { IStrategies } from '@redux/types/strategies';

import { timerGreater24 } from '@utils/functions';
import { find_side } from '@data/strategies';

import Container from '@components/container/Style1';
import Text2 from '@components/text/Style2';
import Flex from '@components/flex/Flex';

interface PropsWaiting {
    trading: ISimulator,
    strategy: IStrategies,
    price_latest: number,
}

const Waiting = ({trading, strategy, price_latest}: PropsWaiting) => {

    const calc_price_difference = (price_snapshot: number, long: number, short: number) => {
        const {strategy: s} = strategy;
        if(s === "counter"){
            return {
                buy: (price_snapshot - long).toFixed(5),
                sell: (price_snapshot + short).toFixed(5),
            }
        }
        if(s === "counter long only"){
            return {
                buy: (price_snapshot - long).toFixed(5),
            }
        }
        if(s === "counter short only"){
            return {
                sell: (price_snapshot + short).toFixed(5),
            }
        }
        if(s === "trend"){
            return {
                buy: (price_snapshot + long).toFixed(5),
                sell: (price_snapshot - short).toFixed(5),
            }
        }
        if(s === "trend long only"){
            return {
                buy: (price_snapshot + long).toFixed(5),
            }
        }
        if(s === "trend short only"){
            return {
                sell: (price_snapshot - short).toFixed(5),
            }
        }
        return {
            buy: "0",
            sell: "0"
        }
    }

    const difference = calc_price_difference(trading.price_snapshot, strategy.long, strategy.short);

    const buy_difference = Math.abs(Number(difference?.buy) - price_latest).toFixed(5);

    const sel_difference = Math.abs(Number(difference?.sell) - price_latest).toFixed(5);

    const side = find_side(strategy.strategy);

    return(
        <Container background='dark' margin>

            <Flex>
                <Text2 name="$Snapshot" value={trading.price_snapshot}/>
                {side === "both" &&
                    <>
                        <Text2 name="$Buy" value={difference?.buy} color="green"/>
                        <Text2 name="$Sell" value={difference?.sell} color="red"/>
                    </>
                }
                {side === "buy" &&
                    <>
                        <Text2 name="$Buy" value={difference?.buy} color="green"/>
                        <Text2 name="Difference" value={buy_difference} color="green"/>
                    </>
                }
                {side === "sell" &&
                    <>
                        <Text2 name="$Sell" value={difference?.sell} color="red"/>
                        <Text2 name="Difference" value={sel_difference}  color="red"/>
                    </>
                }
            </Flex>

            {side === "both" && 
                <Flex padding={{top: 5, bottom: 5}}>
                    <Text2 name="Reset in" value={trading.reset ? timerGreater24(trading.reset) : "not set"} />
                    <Text2 name="Difference" value={buy_difference} color="green"/>
                    <Text2 name="Difference" value={sel_difference}  color="red"/>
                </Flex>
            }

        </Container>
    )
}

export default Waiting