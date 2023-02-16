import styles from './Navbar.module.scss';

import Login from './login';
import Theme from './theme';
import Pages from './pages';

const Navbar = () => {
  return (
    <div className={styles.container}>

      <div className={styles.left}>
        <Pages />
      </div>

      <div className={styles.right}>
        <Theme />
        <Login />
      </div>

    </div>
  )
}

export default Navbar