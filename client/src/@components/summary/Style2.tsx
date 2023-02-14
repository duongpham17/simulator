import styles from './Style2.module.scss';
import React, {useState} from 'react';
import {MdKeyboardArrowRight} from 'react-icons/md';

interface Props extends React.HTMLAttributes<HTMLDivElement>{
    title: string,
    small? : string| React.ReactElement,
    open?: boolean, 
    selected?: boolean,
    iconOpen?: string | React.ReactElement,
    iconClose?: string | React.ReactElement,
    section?: React.ReactNode,
    children: React.ReactNode
}

const Style1 = ({title, small, iconOpen, iconClose, open=false, children, selected, section,...props}: Props) => {
    const [isOpen, setisOpen] = useState(open);

    return (
        <div className={`${styles.container} ${styles[selected ? "selected" : "default"]}`} {...props}>

            <div onClick={() => setisOpen(!isOpen)} className={styles.btn}>
                <div className={styles.flex}>
                    <span>{title}</span>
                    { (!iconOpen && !iconClose) && <span className={!isOpen ? styles.iconClosed : styles.iconOpen}>{<MdKeyboardArrowRight/> }</span>}
                    { (iconOpen && !iconClose) && iconOpen}
                    { (iconOpen && iconClose) && isOpen ? iconOpen : iconClose}
                </div>
                {small && <small>{small}</small>}
                <div>
                    {section}
                </div>
            </div>

            {isOpen && 
                <div className={styles.children}>
                    {children}
                </div>
            }
            
        </div>
    )
}

export default Style1