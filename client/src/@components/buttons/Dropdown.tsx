import styles from './Dropdown.module.scss';
import React from 'react';
import {MdKeyboardArrowRight} from 'react-icons/md';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: string | React.ReactNode; 
    open?: boolean
};

const Dropdown = ({icon, open, ...props}: Props) => {
    return (
        <button {...props} className={`${styles.container} ${open?styles.open:""}`}>
            { icon || <MdKeyboardArrowRight/> }
        </button>   
    )
}

export default Dropdown