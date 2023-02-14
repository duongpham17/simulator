import styles from './Menu.module.scss';
import React from 'react';
import {BiMenuAltRight} from 'react-icons/bi';

interface Props {
  children: React.ReactNode,
  icon?: React.ReactNode | React.ReactElement
}

const Menu = ({children, icon}: Props) => {
  return (
    <div className={styles.container} onClick={e => e.stopPropagation()}>
        {!icon && <button className={styles.btn}><BiMenuAltRight/></button>}
        {icon && <button className={styles.btn}>{icon}</button>}
        <div className={styles.menu} onClick={e => e.stopPropagation()}>
          {children}
        </div>
    </div>
  )
}

export default Menu