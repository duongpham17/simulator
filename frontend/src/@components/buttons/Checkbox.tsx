import styles from './Checkbox.module.scss';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    name: string;
    selected?: boolean,
};

const Checkbox = ({name, selected, ...props}: Props) => {
    return (
        <button {...props} className={`${styles.button} ${selected && styles.selected}`}>
            <p>{name}</p>
            <span className={selected ? styles.selected : ""} />
        </button>   
    )
}

export default Checkbox