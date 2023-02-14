import styles from './Style1.module.scss';
import {useState} from 'react';

interface Props {
    images_ipfs: string[],
    width: number,
    height: number,
    small?: number
}

const Style1 = ({images_ipfs, width, height, small=30}: Props) => {

    const [big, setBig] = useState(images_ipfs[0]);
    
    return (
        <div className={styles.container}>

            <div className={styles.small}>
                {images_ipfs.map((ipfs, index) => 
                    <img className={`${ipfs === big && styles.selected}`} key={index} src={`https://ipfs.io/ipfs/${ipfs}`} alt="ipfs" width={small} height={small} onClick={() => setBig(ipfs)}/>    
                )}
            </div>
         
            <div className={styles.big}>
                <img src={`https://ipfs.io/ipfs/${big}`} alt="ipfs" width={width} height={height}/>    
            </div>
            
        </div>
    )
}

export default Style1