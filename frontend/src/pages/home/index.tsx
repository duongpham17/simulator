import styles from './Home.module.scss';

import { useContext } from 'react';
import { Context } from 'themes';

import black_logo from '@assets/logo/black.png';
import white_logo from '@assets/logo/white.png';
import axios from 'axios';
import { useAppSelector } from '@redux/hooks/useRedux';

const Home = () => {

  const {theme} = useContext(Context);

  const {strategy} = useAppSelector(state => state.strategies)

  const storage = localStorage.getItem("user");

  const user = storage ? JSON.parse(storage) : {};

  const api = axios.create({
      baseURL: "http://localhost:8000/api",
      headers: { 
          "Content-Type": "application/json",
          "Authorization": `${user.token}`
      },
  });

  const onClick = async () => {
    try{
      const res = await api.post("/trades/testing", {strategy});
      console.log(res);
    } catch(err: any){
      console.log(err.response);
    }
  }

  return (
    <div className={styles.container}>
      <img src={theme.name === "light" ? white_logo : black_logo} alt="bot" width={"40%"}/>
      <h1>SIMULATOR</h1>
      <button onClick={onClick}>API</button>
    </div>
  )
}

export default Home