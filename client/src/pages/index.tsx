import styles from './Pages.module.scss'
import {Routes, Route} from 'react-router-dom';

import Private from 'pages/Private';

import Home from 'pages/home';
import Login from 'pages/login';
import Confirm from 'pages/confirm';
import Account from 'pages/account';
import Trade from 'pages/trade'
import Unknown from 'pages/unknown';
import simulator from 'pages/simulator';

const Pages = () => {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/confirm/:token" element={<Confirm/>} />

        <Route path="/account" element={<Private component={Account}/> } />
        <Route path="/trade" element={<Private component={Trade}/> } />
        <Route path="/simulator" element={<Private component={simulator}/> } />

        <Route path="*" element={<Unknown/>} />
      </Routes>
    </div>
  )
}

export default Pages