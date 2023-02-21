import styles from './Simulators.module.scss';
import { useAppSelector } from '@redux/hooks/useRedux';
import { UseSimulatorContext } from 'context/useSimulator';

import Empty from './empty';
import Simulators from './simulators';
import Simulator from './simulator';
import Run from './run';
import Simulated from './simulated';
import Loading from '@components/loading/Fish';

import useFetching from '@hooks/useFetching';
import useQuery from '@hooks/useQuery';

const Trade = () => {

  const {simulators} = useAppSelector(state => state.simulators);

  const {fetching} = useFetching({ seconds: 10, dependency: simulators});

  const {getQueryValue} = useQuery();

  const simulatorId = getQueryValue("simulator");

  return ( 
      <UseSimulatorContext>
        {fetching ? <Loading /> :
          <>
            { simulators && simulators.length ?
              <div className={styles.container}>
                  <div className={styles.control}>
                    <Simulators simulators={simulators}/>
                  </div>

                {simulatorId &&
                  <div className={styles.trades}>
                    <Simulator />
                    <Run />
                    <Simulated />
                  </div>
                }
              </div>
            :
              <Empty/>
            }
          </>
        }
      </UseSimulatorContext>
  )
}

export default Trade