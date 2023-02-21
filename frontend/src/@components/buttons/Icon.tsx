import styles from './Icon.module.scss';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string | React.ReactNode;
    color?: "red",
};

const Icon = ({icon, color, ...props}: Props) => {
    return (
        <button {...props} className={`${styles.container} ${styles[color ? color : "default"]}`}>
            { icon }
        </button>   
    )
}

export default Icon