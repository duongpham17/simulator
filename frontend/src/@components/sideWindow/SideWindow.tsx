import styles from './SideWindow.module.scss';
import {ReactElement, ReactNode} from 'react';
import {AiOutlineMenu} from 'react-icons/ai';

interface Props {
    children: ReactNode | ReactElement,
    button?: ReactElement,
    cover?: boolean,
}

export const SideWindow = ({children}: Props) => {

    return (
        <div className={ styles.container}>
            
            <button className={styles.menuBtn}> 
                <AiOutlineMenu/>
            </button>
            
            <div className={styles.cover}>
                <div className={styles.children}>
                    {children}
                </div>
            </div>

        </div>
    )
}

export default SideWindow