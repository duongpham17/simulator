import { useAppSelector } from '@redux/hooks/useRedux';
import useQuery from '@hooks/useQuery';

import { date, generateid } from '@utils/functions';

import Text3 from '@components/text/Style3';
import Summary from '@components/summary/Style1';

import Stats from './Stats';
import Orders from './Orders';
import Actions from './Actions';

const Simulated = () => {

    const {getQueryValue} = useQuery();

    const simulatorID = getQueryValue("simulator");

    const {simulated} = useAppSelector(state => state.simulators)

    return ( simulated ? 
        <>
            {simulated.filter((el) =>  el.simulator._id === simulatorID).map((el) => 
                <Summary 
                    key={generateid()}
                    background='dark'
                    title={<>{el.strategy.strategy} &#x2022; {el.simulator.live ? "live" : "test"}</>} 
                    small={<Text3 name={el.simulator.market_id.toLowerCase()} value={date(el.simulator.createdAt)} color="light"/>} 
                    section={<Stats data={el}/>}
                > 

                    <Orders data={el} />

                    <Actions data={el} />

                </Summary>
            )}
        </>
        :
        null
    )
}

export default Simulated