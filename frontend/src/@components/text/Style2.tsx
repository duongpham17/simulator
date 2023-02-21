import styles from './Style2.module.scss';
import React from 'react';

interface Props {
    name: string | React.ReactNode | React.ReactElement,
    value: string | React.ReactNode | React.ReactElement,
    color?: "red" | "light" | "green",
    size?: number,
}

const Style2 = ({name, value, size=16, color}: Props) => (
    <p className={`${styles.container} ${styles[color ? color : ""]}`} style={{"fontSize": `${size}px`}}> 
        <span>{name}</span> <br/>
        <span>{value}</span>
    </p>
);

export default Style2