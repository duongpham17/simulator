import styles from './Slidein.module.scss';
import { ReactElement, ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface Types {
  children: ReactNode | ReactElement,
  icon: ReactNode | ReactElement,
  autoClose?: boolean
}

const Sidebar = ({children, icon, autoClose=true}: Types) => {

    const location = useLocation();

    const [open, setOpen] = useState<boolean>(false); 

    const onOpen = (): void => setOpen(!open);

    useEffect(() => {
        if(!autoClose) return;
        setOpen(false);
    }, [location, autoClose]);

    return (
        <div className={styles.container}>
            <div className={styles.icon} onClick={onOpen}> {icon} </div>                                              
            { open &&
                <div className={styles.cover} onClick={onOpen}>
                    <div className={styles.sidebar} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={onOpen}>&#x2190;</button>
                        {children}
                    </div>
                </div>
            }
        </div>
    )
}

export default Sidebar