import styles from './Favourite.module.scss';
import React from 'react';

import { FaStar } from 'react-icons/fa';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    selected?: boolean,
    size?: number,
}

const Favourite = ({selected, size, ...props}: Props) => {
  return (
    <button {...props}><FaStar className={selected ? styles.selected : styles.star} size={size}/></button>
  )
}

export default Favourite