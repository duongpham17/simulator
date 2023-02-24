import styles from './List.module.scss';
import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: any,
    selected?: boolean,
    hover?: string | number,
    icon?: string
};

const List = ({value, hover, icon, selected, ...props}: Props) => {
    return (
        <div className={styles.container}>
            <button {...props} className={selected ? styles.selected : ""}>
                <span>{value}</span>
                {hover && <small>{hover}</small>}
                {icon && <img src={icon} alt="listitems"/>}
            </button>
        </div>
    )
}

export default List