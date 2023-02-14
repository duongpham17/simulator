import styles from './Navbar.module.scss';
import { Link } from 'react-router-dom';

import Login from './login';
import Theme from './theme';

const Navbar = () => {
  return (
    <div className={styles.container}>

      <div className={styles.left}>
        <Link to="/">CST</Link>
        <Link to="/trade">Trade</Link>
        <Link to="/simulator">Simulator</Link>
      </div>

      <div className={styles.right}>
        <Theme />
        <Login />
      </div>

    </div>
  )
}

export default Navbar