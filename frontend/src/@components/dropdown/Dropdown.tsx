import styles from './Dropdown.module.scss';
import React from 'react';
import {AiOutlineMenu} from 'react-icons/ai';

interface Props {
    children: React.ReactNode;
}

const Dropdown = ({children}: Props) => {

    return (
        <div className={styles.container}>

            <button className={styles.dropdownBtn}>
                <AiOutlineMenu/>
            </button>

            <div className={styles.children}>
                {children}
            </div>

        </div>
    )
}

export default Dropdown