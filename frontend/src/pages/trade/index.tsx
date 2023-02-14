import styles from './Trade.module.scss';

import { useAppSelector } from '@redux/hooks/useRedux';
import { UseTradeContext } from 'context/useTrade';

import Strategy from './strategy';
import Strategies from './strategies';
import Build from './build';
import Trades from './trades'
import Run from './run';
import Trading from './trading';
import Statistics from './statistics';
import History from './history';
import Chart from './chart';

const Trade = () => {

  const {strategy} = useAppSelector(state => state.strategies)

  return (
    <div className={styles.container}>
      <UseTradeContext>

        <div className={styles.content1}>
          <Build/>
          
          <Strategies/>
        </div>

        {strategy &&
        <>
            <div className={styles.content2}>
              <Trades />

              <Run />

              <Strategy />

              <Chart />

              <Statistics />

            </div>

            <div className={styles.content3}>
              <Trading />

              <History />
            </div>
          </>
        }
        
      </UseTradeContext>
    </div>
  )
}

export default Trade