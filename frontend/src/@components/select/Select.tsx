import styles from './Select.module.scss';
import React, {useState} from 'react';
import {MdOutlineKeyboardArrowRight} from 'react-icons/md';

interface Props<T>{
    label1: string;
    selected: string | number | null | undefined,
    items: T[];
    style?: {[key:string]: string},
    children: (items: T[]) => React.ReactNode,
};

const Select = <T,>({label1, items, selected, children, style}: Props<T>) => {

    const [open, setOpen] = useState(false);

    const onClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(!open)
    }

    return (
        <div className={styles.container} onClick={onClick} style={style}>

            <button className={styles.button} onClick={onClick}>
                <p>{!selected && label1} {selected && selected} </p>
                <span className={open ? styles.open : styles.closed}><MdOutlineKeyboardArrowRight/></span>
            </button>

            {open && 
                children(items)
            }

        </div>
    )
}

export default Select