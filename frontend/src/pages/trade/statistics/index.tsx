import { useAppSelector } from '@redux/hooks/useRedux';

import Container from '@components/container/Style1';
import Text2 from '@components/text/Style2';
import Flex from '@components/flex/Flex';

const Statistics = () => {

    const {prices, price_latest} = useAppSelector((state) => state.trades);

    const prices_converted: number[] = !prices ? [] : prices.map(el => el.price);

    const max = (array: number[]): string => Math.max.apply(Math, array).toFixed(5);

    const min = (array: number[]): string => Math.min.apply(Math, array).toFixed(5);

    const average = (array: number[]): string => array.length ? (array.reduce((acc, cur) => acc + cur) / array.length).toFixed(5) : "";
    
    return ( prices 
        ?
            <Container noBorder>
                <Flex center>
                    <Text2 name="Latest"   value={price_latest}              size={15}/>
                    <Text2 name="Highest"  value={max(prices_converted)}     size={15}/>
                    <Text2 name="Lowest"   value={min(prices_converted)}     size={15}/>
                    <Text2 name="Average"  value={average(prices_converted)} size={15}/>
                </Flex>
            </Container>
        : 
            null
    )
}

export default Statistics