import styles from './Style2.module.scss';
import { useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface Props {
    images_ipfs: string[],
    width?: number,
    height?: number,
    link?: string
}

const Style2 = ({images_ipfs, width=400, height=400, link}: Props) => {

    const [currentImage, setCurrentImage] = useState(images_ipfs[0]);

    const [hovering, setHovering] = useState(false);

    const onSwitchImage = (action: "prev" | "next") => {
        const total_images = images_ipfs.length - 1;
        const current_index = images_ipfs.findIndex(str => str.includes(currentImage));
        if(action === "prev"){
            if(current_index === 0) return setCurrentImage(images_ipfs[total_images]);
            setCurrentImage(images_ipfs[current_index-1])
        };
        if(action === "next"){
            if(current_index === total_images) return setCurrentImage(images_ipfs[0]);
            setCurrentImage(images_ipfs[current_index+1]);
        };
    };
    
    return (
        <div className={styles.container} onMouseOver={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
         
            <button className={`${styles.buttonLeft} ${hovering && styles.hovering}`} onClick={() => onSwitchImage("prev")}><MdKeyboardArrowLeft/></button>

            <Link to={link ? link : ""} className={styles.image}>
                <img src={`https://ipfs.io/ipfs/${currentImage}`} alt="ipfs" width={width} height={height}/>    
            </Link>

            <div className={styles.line}>
                {images_ipfs.map((ipfs, index) => 
                    <button key={index} className={`${currentImage === ipfs && styles.selected}`} onClick={() => setCurrentImage(ipfs)} />
                )}
            </div>

            <button className={`${styles.buttonRight} ${hovering && styles.hovering}`} onClick={() => onSwitchImage("next")}><MdKeyboardArrowRight/></button>
            
        </div>
    )
}

export default Style2