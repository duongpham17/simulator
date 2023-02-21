import styles from './Style3.module.scss';
import React from 'react';

interface Props {
    name: string | React.ReactNode | React.ReactElement,
    value: string | React.ReactNode | React.ReactElement,
    color?: "red" | "green" | "light" | "main",
    size?: number,
}

const Style3 = ({name, value, color, size}: Props) => (
    <p className={`${styles.container} ${styles[color ? color : ""]}`} style={{"fontSize": `${size}px`}}> 
        <span>{name}</span>
        <span>{value}</span>
    </p>
);

export default Style3