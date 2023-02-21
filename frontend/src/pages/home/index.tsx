import styles from './Home.module.scss';

import { useContext } from 'react';
import { Context } from 'themes';

import black_logo from '@assets/logo/black.png';
import white_logo from '@assets/logo/white.png';

const Home = () => {

  const {theme} = useContext(Context);

  return (
    <div className={styles.container}>
      <img src={theme.name === "light" ? white_logo : black_logo} alt="bot" width={"40%"}/>
      <h1>SIMULATOR</h1>
    </div>
  )
}

export default Home