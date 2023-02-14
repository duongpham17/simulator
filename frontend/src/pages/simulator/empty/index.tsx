import styles from './Empty.module.scss';
import {Link} from 'react-router-dom';

const Empty = () => {
  return (
    <div className={styles.container}>
        <Link to="/trade">
            No data to simulate, start by going to trade
        </Link>
    </div>
  )
}

export default Empty