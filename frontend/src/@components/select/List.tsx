import styles from './List.module.scss';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string | number,
    hover?: string | number,
    icon?: string
};

const List = ({value, hover, icon, ...props}: Props) => {
    return (
        <div className={styles.container}>
            <button {...props}>
                <span>{value}</span>
                {hover && <small>{hover}</small>}
                {icon && <img src={icon} alt="exchange"/>}
            </button>
        </div>
    )
}

export default List