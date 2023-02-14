import styles from './Header.module.scss';
import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement>  {
    label1: string | React.ReactNode;
    label2?: string | React.ReactNode;
    label3?: string,
    border?: boolean,
    selected?: boolean,
};

const Header = ({label1, label2, label3, border, selected, ...props}: Props) => {
    return (
        <div className={`${styles.container} ${border ? styles.border : "default"} ${selected ? styles.selected : "default"}`} {...props}>
            <div>
                <p>{ label1 }</p>
                { label2 }
            </div>
            <small>{label3}</small>
        </div>   
    )
}

export default Header