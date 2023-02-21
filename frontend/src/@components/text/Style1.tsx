import styles from './Style1.module.scss';
import React from 'react';

interface Props {
    name: string | React.ReactNode | React.ReactElement,
    value: string | React.ReactNode | React.ReactElement,
    valueColor?: "light" | "red" | "green",
    nameColor?: "light" | "default",
    size?: number,
}

const Style1 = ({name, value, size, valueColor="light", nameColor="light"}: Props) => (
    <p className={`${styles.container} ${styles[valueColor ? `value-${valueColor}` : ""]} ${styles[nameColor ? `name-${nameColor}` : ""]}`} style={{"fontSize": `${size}px`}}> 
        <span>{name}</span>
        <span>{value}</span>
    </p>
);

export default Style1