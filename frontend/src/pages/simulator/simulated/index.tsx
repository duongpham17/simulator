import { useAppSelector } from '@redux/hooks/useRedux';
import useQuery from '@hooks/useQuery';
import Element from './Element';

const Simulated = () => {

    const {getQueryValue} = useQuery();

    const simulatorID = getQueryValue("simulator");

    const {simulated} = useAppSelector(state => state.simulators)

    return ( simulated ? 
        <>
            {simulated.filter((el) =>  el.simulator._id === simulatorID).map((el, index) => 
                <Element data={el} key={index} />
            )}
        </>
        :
        null
    )
}

export default Simulated